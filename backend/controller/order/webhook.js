const Stripe = require('../../config/stripe')
const orderModel = require('../../models/orderProductModel')

const endpointSecret = process.env.STRIPE_EBNDPOINT_WEBHOOK_SECRET_KEY


async function getLineItems(lineItems){
    let ProductItems = []

    if (lineItems?.data?.length > 0){
        for(const item of lineItems.data){
            const product = await stripe.product.retrieve(item.price.product)
            const productId = product.metadata.productId

            const productData = {
                productId : productId,
                name : product.name,
                price : item.price.unit_amount/100,
                quantity : item.quantity,
                image : product.images
            }

            ProductItems.push(productData)


        }
    }

    return ProductItems
}

const webhook = async (req, res) => {
    const signature = request.headers['stripe-signature'];

    const payloadString = JSON.stringify(request.body);

    const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret : endpointSecret,
    });
    
    let event;

    try {
        event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret); 
      
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);

    }

    switch (event.type) {
        case 'checkout.session.succeeded':
            const session = event.data.object;

            console.log("sessions", session)
            const lineItems = await stripe.checkout.session.listlineItems(session.id);

            const productDetails = await  getLineItems(lineItems)

            const orderDetails = {
                productDetails : productDetails,
                email :    session.customer_details.email,
                userID : session.metadata.userId,
                paymentDetails : {
                    paymentId : session.payment_intent,
                    payment_method_type : session,payment_method_types,
                    payment_staus : session.payment_status  
                },

                shipping_option : session.shipping_option,
                totalAmouunt : session.amount_total/100 
            }

            const order = new orderModel (orderDetails)
            const saveOrder = await order.save()

            break;
       
        default:
          
          console.log(`Unhandled event type ${event.type}.`);
      }

    response.status(200).send();
}

module.exports =  webhook
