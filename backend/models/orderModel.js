const mongoose =require('mongoose')

const orderSchema=new mongoose.Schema({

    productID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    TotalAmount:{
        type:Number,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    Quantity:{
        type:Number,
        required:true
    },
    Size:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        default:"pending"
    },
    
}
,{
    timestamps:true
})


const orderModel=mongoose.model("Order",orderSchema)
module.exports=orderModel