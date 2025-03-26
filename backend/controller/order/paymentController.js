const stripe = require('../../config/stripe')
const userModel  = require('../../models/userModel')
const paymentController = async(request, response) =>{
    try{
        const { cartItems } = request.body

        const user = await userModel.findOne({_id :  request.userId})
        
        const params = {
            submit_type : 'payment',
            payment_method_types : ['card'],
            billing_address_collection : 'auto',
            shipping_option : [
                {
                    shipping_rate : 'shr_1R305QH17pxTT9iNkd0mH6WU'
                }
            ],
            customer_email : user.email,
            metadata : {
                userId : request.userId 

            },
            line_items : cartItems.maps((items,index)=>{
                return{
                    price_data : {
                        currency : 'usd',
                        product_data :{
                            name : item.productId.productName,
                            images : [item.productId.productImage],
                            metadata : {
                                productId : item.productId._id.toString()
                            }  
                        },
                        unit_amount : item.productId.sellingPrice + 100
                    },
                        adjetable_quantities : {
                            enabled : true,
                            minimum : 1,
                        },
                      
                        quantite : item.quantity,
                        
                }
            }),

            success_url : '${process.env.FRONTEND_URL}/Success',
            cancel_url : '${process.env.FRONTEND_URL}/Cancel',

        }

        const session = await stripe.checkout.sessions.create(params)
        responce.status(303).json(session)

    }catch (erorr){
        response.json({
            message : erorr?.message || erorr,
            eroor : true,
            success : false
        }) 

    }
}

module.exports = paymentController