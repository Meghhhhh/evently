const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    isVenue:{
        type:Boolean,
        default:false
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    totalPrice:{
        type:Number,
    },
    items:[{
        itemName:{
            type:String,
        },
        itemPrice:{
            type:Number,
        }
    }],
});

module.exports = mongoose.model("Cart",cartSchema);