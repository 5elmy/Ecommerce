import slugify from "slugify";
import categoryModel from "../../../../DB/model/Category.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import cloudinary from "../../../utils/cloudinary.js";

export const createSubCategory =async(req ,res,next)=>{
     //const {categoryId} =req.params;
     
    if(!await categoryModel.findOne({_id:req.params.categoryId}))
    {
        return next(new Error("in-vaild category...",{cause:400}));
    }
  
     const name= req.body.name.toLowerCase()
    if(await subCategoryModel.findOne({name}))
    {
        return next(new Error("Dublicated SubCategory Name...",{cause:409}));
    }

    const  { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/${req.params.categoryId}/subCategory`})
    const subCategory = await subCategoryModel.create({
        name,
        slug:slugify(name,{
            replacement:"_",
            trim:true,
            lower:true
        }),
        image: { secure_url, public_id } ,
        categoryId:req.params.categoryId,
        createdBy:req.user.id
    })
    if(!subCategory)
    {
        return next (new Error("fail to create subCategory",{cause:400}))
    }


   return  res.status(201).json({message:"Done ",subCategory})
}



//update

export const updateSubCategory= async(req,res,next)=>{

    const subCategory= await subCategoryModel.findById(req.params.subCategoryId);
    if(!subCategory)
    {
        return next(new Error("in-vaild subCategory id..",{cause:400}))
    }
   if(req.body.name)
   {
    req.body.name=req.body.name.toLowerCase()
    
    if(subCategory.name == req.body.name)
    {
        return next(new Error('Old Name equal New Name...',{cause:400}))
    }
    if(await subCategoryModel.findOne({name:req.body.name}))
    {
        return next(new Error('Dublicated Brand Name...',{cause:409}))
    }

    subCategory.name= req.body.name;
    subCategory.slug=slugify(req.body.name,{
        replacement:"_",
        trim:true,
        lower:true
    })  //slugify(req.body.name,"_") 
   }
   
    
 
    if(req.file)
    {
     const  { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/${categoryId}/subCategory`})
    if(subCategory.image?.public_id)
    {
        await cloudinary.uploader.destroy(subCategory.image?.public_id)
    }
     subCategory.image={secure_url,public_id}
    }

    subCategory.updatedBy= req.user.id
     await subCategory.save()

   return  res.status(200).json({message:"Done ",subCategory})

}