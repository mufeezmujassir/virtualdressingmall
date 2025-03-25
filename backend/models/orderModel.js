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
    OrderDate:{
        type:Date,
       default: () => {
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const year = today.getFullYear();
            return `${month}/${day}/${year}`;
        }
    }
},
{
    timestamps:true
})

const orderModel=mongoose.model("Order",orderSchema)
module.exports=orderModel