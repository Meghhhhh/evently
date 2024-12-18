const mongoose = require("mongoose");
const {Schema} = mongoose;

const vendorSchema = new Schema({

    serviceName:{
        type:String,
        required: true,
        trim: true,
    },


    location:{
        type:String,
        required: true,
        trim: true,
    },


    about:{
        type:String,
        required:true,
        trim:true,
    },

    ratingAndReview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reviews"
    }],

    singleItems:[
        {
            itemName:{
                type:String,
                trim:true,
            },
            
             itemQuantity:{
                type:Number,
             },
             itemPrice:{
                type:Number,
             }
        }
    ],

    packages:[{
        type:Schema.Types.ObjectId,
        ref:"Package"
    }],

    gallery:[{
        type:String,
    }],
    vendorType:{
        type: String,
        enum: ["caterer", "photographer", "decorator"],
        
        required: true,
      },
    booking:{
        type:String,
        required:true,
        trim:true,
    },
    cancellation:{
        type:String,
        required:true,
        trim:true,
    },
    terms:{
        type:String,
        required:true,
        trim:true,
    },
    venue:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Venues",
        required:true,
    },
   
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps: true, 
  }
);
const Vendor = mongoose.model("Vendor",vendorSchema)
module.exports = {Vendor};