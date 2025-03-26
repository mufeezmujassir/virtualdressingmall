const stripe = require('../../config/stripe')
const orderModel = require('../../models/orderProductModel')
const cartModel = require('../../models/cartProduct')

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'

async function getLineItems(sessionId) {
    try {
        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId)
        let productItems = []

        if (lineItems?.data?.length > 0) {
            for (const item of lineItems.data) {
                try {
                    const product = await stripe.products.retrieve(item.price.product)
                    
                    const productId = product.metadata.productId

                    const productData = {
                        productId: productId,
                        name: product.name,
                        price: item.price.unit_amount/100,
                        quantity: item.quantity,
                        image: product.images && product.images.length > 0 ? product.images[0] : null
                    }

                    productItems.push(productData)
                } catch (error) {
                    console.error('Error retrieving product:', error)
                }
            }
        }

        return productItems
    } catch (error) {
        console.error('Error getting line items:', error)
        return []
    }
}

const webhook = async (request, response) => {
    const signature = request.headers['stripe-signature']
    let event

    try {
        const payload = request.body
        
        // Check if signature exists (from production Stripe)
        if (signature && endpointSecret) {
            event = stripe.webhooks.constructEvent(payload, signature, endpointSecret)
        } else {
            // For testing purposes
            event = {
                type: payload.type,
                data: {
                    object: payload.data.object
                }
            }
        }
    } catch (err) {
        console.log(`⚠️ Webhook signature verification failed:`, err.message)
        return response.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object
            
            try {
                console.log("Processing session:", session.id)
                
                // Get line items from the session
                const productDetails = await getLineItems(session.id)
                
                if (!productDetails || productDetails.length === 0) {
                    console.log('No product details found for session', session.id)
                    break
                }

                // Create order object
                const orderDetails = {
                    productDetails: productDetails,
                    email: session.customer_details?.email,
                    userID: session.metadata?.userId,
                    paymentDetails: {
                        paymentId: session.payment_intent,
                        payment_method_types: session.payment_method_types,
                        payment_status: session.payment_status
                    },
                    shipping_address: session.shipping?.address,
                    shipping_details: session.shipping,
                    totalAmount: session.amount_total/100,
                    status: 'processing'
                }

                // Save order to database
                const order = new orderModel(orderDetails)
                await order.save()
                console.log('Order saved:', order._id)

                // Clear cart items after successful checkout
                if (session.metadata?.userId) {
                    await cartModel.deleteMany({ userId: session.metadata.userId })
                    console.log('Cart cleared for user:', session.metadata.userId)
                }
            } catch (error) {
                console.error('Error processing checkout session:', error)
            }
            break
        
        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    // Return a 200 response to acknowledge receipt of the event
    response.status(200).send('Received')
}

module.exports = webhook
