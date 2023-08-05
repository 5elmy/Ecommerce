import slugify from "slugify";
import brandModel from "../../../../DB/model/Brand.model.js"
import cloudinary from "../../../utils/cloudinary.js";



export const brandList= async (req,res,next)=>{
    const Brand= await brandModel.find({isDeleted:false});
    return res.status(200).json({message:"Done",Brand})
}

export const createBrand= async (req,res,next)=>{
    const {name}=req.body ;

    if(await brandModel.findOne({name:name.toLowerCase()}))
    {
        return next(new Error('Dublicated Brand Name...',{cause:409}))
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/Brand`})
  
    const brand = await brandModel.create({
        name,
        slug:slugify(name,{
            replacement:"_",
            trim:true,
            lower:true
        }),
        image: { secure_url, public_id },
        createdBy:req.user.id
    })
    if(!brand)
    {
        return next (new Error("fail to create brand",{cause:400}))
    }
    
    return res.status(201).json({message:"Done",brand})
}

export const updateBrand= async(req,res,next)=>{

    const brand = await brandModel.findById(req.params.brandId);
    if(! brand )
    {
        return next(new Error("in-vaild brand id..",{cause:400}))
    }

   if(req.body.name)
    {
        req.body.name=req.body.name.toLowerCase()
        if(brand.name == req.body.name)
        {
            return next(new Error('Old Name equal New Name...',{cause:400}))
        }
        if(await brandModel.findOne({name:req.body.name}))
        {
            return next(new Error('Dublicated Brand Name...',{cause:409}))
        }
        brand.name= req.body.name;
        brand.slug= slugify(req.body.name,{
            replacement:"_",
            trim:true,
            lower:true
        })          //slugify(req.body.name,"_") 
    }
 
    if(req.file)
    {
        const  { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/Brand`})
        if(brand.image?.public_id)
        {
            await cloudinary.uploader.destroy(brand.image.public_id)
        }
        brand.image={secure_url,public_id}
   }
     brand.updatedBy= req.user.id
     await brand.save()

   return  res.status(200).json({message:"Done ",brand})

}

