import mongoose, { Schema,model, Types } from "mongoose";

const ReviewSchema= new Schema({
 
    createdBy:{ type:Types.ObjectId , ref:"User" , required:true },
    updatedBy:{ type:Types.ObjectId , ref:"User"  },
    productId:{type:Types.ObjectId, ref:"Product", required:true},
    orderId:{type:Types.ObjectId, ref:"Order" , required:true},
    comment:{type:String, required:true },
    rating:{type:Number,min:1,max:5, required:true },
    isDeleted:{type:Boolean , default:false}
},
{
    timestamps:true
})


const reviewModel= mongoose.models.Review || model("Review",ReviewSchema)
export default reviewModel