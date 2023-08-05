import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: Object, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }, //Don't forget to change it to true after the prototype
    updatedBy: { type: Types.ObjectId, ref: 'User'}, 
    isDeleted: { type: Boolean, default: false }
}, {
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps: true
})
categorySchema.virtual("subcategory",{
    localField:"_id",
    foreignField:"categoryId",
     ref:"SubCategory"    // SubCategory==>>    subCategory.model.jsالي هي جوا ال  
})
const categoryModel = mongoose.models.Category || model('Category', categorySchema)
export default categoryModel