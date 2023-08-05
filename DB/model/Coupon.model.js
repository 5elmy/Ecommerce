
import mongoose, { Schema,model, Types } from "mongoose";

const CouponSchema= new Schema({
    name:{   type:String ,unique:true , required:true},
    amount:{ type:Number , default:1 , min:1 , max:100 , required:true },
    image:{ type:Object },
    createdBy:{ type:Types.ObjectId , ref:"User" , required:true },
    updatedBy:{ type:Types.ObjectId , ref:"User" },
    expire:{type:Date , required:true},
    usedBy:[{ type:Types.ObjectId , ref:"User" }],
    isDeleted:{type:Boolean , default:false}
},
{
    timestamps:true
})


const couponModel= mongoose.models.Coupon || model("Coupon",CouponSchema)
export default couponModel