const stripe = require('../../config/stripe')
const userModel  = require('../../models/userModel')

const paymentController = async(request, response) =>{
    try{
        const { cartItems, address } = request.body

        if (!cartItems || !cartItems.length) {
            return response.status(400).json({
                message: 'No items in cart',
                error: true,
                success: false
            });
        }

        const user = await userModel.findOne({_id :  request.userId})
        
        if (!user) {
            return response.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }

        // Format line items for Stripe
        const lineItems = cartItems.map((item) => {
            // Convert price to cents (Stripe requires amount in smallest currency unit)
            const unitAmount = Math.round((item.productId.sellingPrice || 0) * 100);
            
            return {
                price_data : {
                    currency : 'lkr',
                    product_data :{
                        name : item.productId.productName,
                        images : item.productId.productImage && item.productId.productImage.length > 0 
                            ? [item.productId.productImage[0]] 
                            : [],
                        metadata : {
                            productId : item.productId._id.toString()
                        }  
                    },
                    unit_amount : unitAmount
                },
                adjustable_quantity : {
                    enabled : true,
                    minimum : 1,
                    maximum : 10
                },
                quantity : item.quantity,
            }
        })

        // Create a Stripe checkout session
        const params = {
            payment_method_types : ['card'],
            mode : 'payment',
            billing_address_collection : 'auto',
            shipping_address_collection : {
                allowed_countries : ['LK'], // Sri Lanka
            },
            shipping_options : [
                {
                    shipping_rate_data : {
                        type : 'fixed_amount',
                        fixed_amount : {
                            amount : 0, // Free shipping (in cents)
                            currency : 'lkr',
                        },
                        display_name : 'Free shipping',
                        delivery_estimate : {
                            minimum : {
                                unit : 'business_day',
                                value : 3,
                            },
                            maximum : {
                                unit : 'business_day',
                                value : 5,
                            },
                        },
                    },
                },
            ],
            customer_email : user.email,
            metadata : {
                userId : request.userId,
                address : address
            },
            line_items : lineItems,
            success_url : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/Success`,
            cancel_url : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/Cancel`,
        }

        const session = await stripe.checkout.sessions.create(params)
        
        response.status(200).json({
            id : session.id,
            url : session.url,
            success : true
        })

    }catch (error){
        console.error('Stripe payment error:', error);
        response.status(500).json({
            message : error?.message || 'Payment processing failed',
            error : true,
            success : false
        }) 
    }
}

module.exports = paymentController