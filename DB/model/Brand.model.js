import mongoose, { Schema,model, Types } from "mongoose";

const BrandSchema= new Schema({
    name:{   type:String ,unique:true ,lowercase:true , required:true},
    slug:{   type:String  , required:true},
    image:{ type:Object , required:true },
    createdBy:{ type:Types.ObjectId , ref:"User" , required:true },
    updatedBy:{ type:Types.ObjectId , ref:"User"  },
    isDeleted:{type:Boolean , default:false}
},
{
    timestamps:true
})


const brandModel= mongoose.models.Brand || model("Brand",BrandSchema)
export default brandModel