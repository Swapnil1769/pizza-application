const mongoose=require('mongoose');
const User=require('../models/user');
const orderSchema=new mongoose.Schema({

    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true

    },
    items:{
        type:Object,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    paymentType:{
        type:String,
        default:'COD'
    },
    status:{
        type:String,
        default:'Order Placed'
    }

   
},{
    timestamps:true,
});

const Order=mongoose.model('Order',orderSchema);
module.exports=Order;