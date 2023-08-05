import mongoose, { Schema,model, Types } from "mongoose";

const orderSchema= new Schema({

    userId:{ type:Types.ObjectId , ref:"User" , required:true },
    address:String,
    phone:[String],
    products:[{
         name:{type:String,required:true},
         productId:{type:Types.ObjectId , ref:"Product",required:true},
         quantity:{type:Number , default:1},
         unitPrice:{type:Number , default:1},
         finalPrice:{type:Number , default:1},
    }],
    couponId:{type:Types.ObjectId,ref:"Coupon" },
    note:String,
    reason:String,
    totalFinalPrice:{type:Number , default:1},
    status:{
        type:String,
        default:"placed",
        enum:["waitForPayment","placed","rejected","onWay","delivered","canceled"]
    },
    paymentType:{
        type:String,
        default:"cash",
        enum:["cash","card"]
    },

    updatedBy:{ type:Types.ObjectId , ref:"User"  },
    isDeleted:{type:Boolean , default:false}
},
{
    timestamps:true
})


const orderModel= mongoose.models.Order || model("Order",orderSchema)
export default orderModel