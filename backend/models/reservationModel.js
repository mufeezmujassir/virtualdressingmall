const mongoose = require('mongoose')

const reservationSchema=new mongoose.Schema({
    ReservationID:{
        type:String, 
        required:true
    },
    productID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    size:{
        type:String,
        required:true
    },
    Quantity:{
        type:Number,
        required:true   
    },
    ValidateReservation:{
        type:String,
    },
},{
    timestamps:true
})
const resrvationModel=mongoose.model("Reservation",reservationSchema)

module.exports=resrvationModel;