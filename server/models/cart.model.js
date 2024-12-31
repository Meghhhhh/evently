const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    isVenue:{
        type:Boolean,
        default:false,
        required:false
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    totalPrice:{
        type:Number,
    },
    items:{
        itemQuantity:{
            type:Number,
        },
        itemPrice:{
            type:Number,
        }
    },
    package:[{
        packageName:[{
            type:String,
        }],
        packageQuantity:{
            type:Number,
        },
        packagePrice:{
            type:Number,
        }
    }]
});

module.exports = mongoose.model("Cart",cartSchema);