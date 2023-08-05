import slugify from "slugify";
import brandModel from "../../../../DB/model/Brand.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import productModel from "../../../../DB/model/Product.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { paginate } from "../../../utils/paginate.js";
import { ApiFeatures } from "../../../utils/apiFeature.js";


export const productList=async(req,res,next)=>{


    const apiObject = new ApiFeatures(productModel.find({}).populate([
                {
                    path:"review",
                    match:{isDeleted:false}
                }
            ]),req.query).paginate().filter().search().sort().select()

    const products = await apiObject.mongooseQuery ;
    for (let i = 0; i < products.length; i++) {
        let calcRate=0
       for (let j = 0; j < products[i].review?.length; j++) {
        calcRate +=products[i].review[j].rating
        
       }
       const product = products[i].toObject()
       product.avgRating= calcRate / products[i].review?.length;
       products[i]=product  
    }
    return res.status(200).json({message:"Done", products})






   


}


export const createProduct =async (req,res,next)=>{
    const {categoryId,subCategoryId, brandId ,name,price,discount}= req.body;
    // console.log(req.files);
     if(!await subCategoryModel.findOne({_id:subCategoryId, categoryId:categoryId}))
    {
        return next ( new Error('in-vaild subcategory id',{cause:400}))
    }

     if(!await brandModel.findOne({_id:brandId}))
    {
        return next ( new Error('in-vaild brand id',{cause:400}))
    }

    req.body.slug= slugify(name,{
        replacement:"_",
        lower:true,
        trim:true
    })

    req.body.finalPrice= Number.parseFloat(price-(price*((discount || 0) / 100))).toFixed(2) 
    req.body.customId=nanoid(5)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}`})
  
    req.body.mainImage= {secure_url,public_id}
    if(req.files?.subImages?.length)
    {
        req.body.subImages=[]
        for (const image of req.files.subImages) {
            const {secure_url,public_id} = await cloudinary.uploader.upload(image.path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}/subimage`})
            req.body.subImages.push({secure_url,public_id})
        }
    }
    req.body.createdBy= req.user.id

    const product = await productModel.create(req.body)
    return res.status(201).json({message:"Done", product})
}

export const updateProduct =async (req,res,next)=>{
    const {productId}= req.params
    const {categoryId,subCategoryId, brandId ,name,price,discount}= req.body;
  
    const product = await productModel.findById(productId) 
    if(!product)
    {
        return next ( new Error('in-vaild product id ',{cause:400}))

    }
    if(categoryId && subCategoryId)
    {
        if(!await subCategoryModel.findOne({_id:subCategoryId, categoryId:categoryId}))
        {
            return next ( new Error('in-vaild subcategory id',{cause:400}))
        }
    }

    if(brandId)
    {
        if(!await brandModel.findOne({_id:brandId}))
        {
            return next ( new Error('in-vaild brand id',{cause:400}))
        }
    }

    if(name)
    {
        req.body.slug= slugify(name,{
            replacement:"_",
            trim:true,
            lower:true
        }) // slugify(name,"_")
    }
    req.body.finalPrice= (price || discount) ? Number.parseFloat((price || product.price)-((price || product.price )*((discount ||product.discount ) / 100))).toFixed(2) : product.finalPrice

      
    // if(price && discount)
    // {
    //     req.body.finalPrice= Number.parseFloat(price-(price*((discount) / 100))).toFixed(2) 

    // }else if(price)
    // {
    //     req.body.finalPrice= Number.parseFloat(price-(price*((product.discount || 0) / 100))).toFixed(2) 

    // }else if(discount)
    // {
    //     req.body.finalPrice= Number.parseFloat(product.price-(product.price*((discount ) / 100))).toFixed(2) 
    // }

 

    if(req.files?.mainImage?.length)
    {
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/${product.customId}`})
        await cloudinary.uploader.destroy(product.mainImage.public_id)
        req.body.mainImage= {secure_url,public_id}
    }
   
    if(req.files?.subImages?.length)
    {
        req.body.subImages=[]
        for (const image of req.files.subImages) {
            const {secure_url,public_id} = await cloudinary.uploader.upload(image.path,{folder:`${process.env.APP_NAME}/product/${product.customId}/subimage`})
            req.body.subImages.push({secure_url,public_id})
        }
    }
    req.body.updatedBy= req.user.id
    await productModel.updateOne({_id:productId},req.body,{new:true})


    return res.status(201).json({message:"Done", product})
}

export const wishList= async(req,res,next)=>{
    const {productId}= req.params;
    if(!await productModel.findOne({_id:productId , isDeleted:false}))
    {
        return next(new Error("In-vaild product ",{cause:400}))
    }
    await userModel.updateOne({_id:req.user.id },{ $addToSet :{wishList:productId}})
    return res.status(200).json({message:"Done"})
}
export const removeFromWishList= async(req,res,next)=>{
    const {productId}= req.params;
 
    await userModel.updateOne({_id:req.user.id },{ $pull :{wishList:productId}})
    return res.status(200).json({message:"Done"})
}