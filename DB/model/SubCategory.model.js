import mongoose, { model, Schema, Types } from "mongoose";

const subCategorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: Object, required: true },
    categoryId:{type: Types.ObjectId ,ref:"Category",required:true},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },   //Don't forget to change it to true after the prototype
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})
const subCategoryModel = mongoose.models.SubCategory || model('SubCategory', subCategorySchema)
export default subCategoryModel