import categoryModel from '../../../../DB/model/Category.model.js';
import cloudinary from '../../../utils/cloudinary.js'
import slugify from 'slugify'





export const categoryList = async (req, res, next) => {
    const category = await categoryModel.find({ isDeleted: false }).populate([
        {
         path:"subcategory"
        }
        
    ])
    return res.status(200).json({ message: "Done", category })
}

export const createCategory = async (req, res, next) => {
    const { name } = req.body;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` })
    const category = await categoryModel.create({
        name,
        slug: slugify(name,{
            replacement:"_",
            trim:true,
            lower:true
        }),
        image: { secure_url, public_id },
        createdBy:req.user.id
    })
    if (!category) {
        await cloudinary.uploader.destroy(public_id)
        return next(new Error('Fail to create this category', { cause: 400 }))
    }
    return res.status(201).json({ message: "Done", category })
}



export const updateCategory =async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId)
    if (!category) {
        return next(new Error("In-valid Category ID", { cause: 404 }))
    }

    if (req.body.name) {
        category.name = req.body.name;
        category.slug = slugify(req.body.name,{
            replacement:"_",
            trim:true,
            lower:true
        }) //slugify(req.body.name, '_');
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.APP_NAME}/category` })
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image = { secure_url, public_id }
    }
   category.updatedBy=req.user.id
    await category.save()
    return res.status(200).json({ message: "Done", category })
}