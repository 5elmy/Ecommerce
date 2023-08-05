import couponModel from "../../../../DB/model/Coupon.model.js";
import cloudinary from "../../../utils/cloudinary.js";


export const createCoupon= async(req,res,next)=>{
     req.body.name=req.body.name.toLowerCase()

    if(await couponModel.findOne({name:req.body.name}))  //to less use memory
    {
      return next (new Error("Duplicated coupon name",{cause:409})) 
    }
    if(req.file)
    {
        const {secure_url,public_id} = cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/Coupon`})
        req.body.image={secure_url,public_id}
    }
    req.body.createdBy= req.user.id
    const coupon = await couponModel.create(req.body);
    if(!coupon)
    {
        return next (new Error("fail to create coupon",{cause:400}))
    }
    return res.status(201).json({message:"Done",coupon})

}

export const updateCoupon= async(req,res,next)=>{
    //const {categoryId,subCategoryId}= req.params;
    const coupon= await couponModel.findById(req.params.couponId);
    if(!coupon)
    {
        return next(new Error("in-vaild subCategory id..",{cause:400}))
    }
   if(req.body.name)
   {
    req.body.name=req.body.name.toLowerCase()

    if(coupon.name == req.body.name)
    {
      return next(new Error('Can not update coupon with the same name ...',{cause:400}))
    }

    if(await couponModel.findOne({name:req.body.name})) //to less use memory
    {
      return next (new Error("Duplicated coupon name",{cause:409})) 
    }

    //coupon.name= req.body.name
   }

   if(req.body.amount)
   {
    if(coupon.amount == req.body.amount)
    {
      return next(new Error('Can not update coupon with the same amount ...',{cause:400}))
    }

     //coupon.amount= req.body.amount
   }
    if(req.file)
    {
     const  { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/Coupon`})
     if(coupon.image?.public_id)
     {
        await cloudinary.uploader.destroy(coupon.image?.public_id)
     }
    // coupon.image={secure_url,public_id}
     req.body.image={secure_url,public_id}
    }

    //coupon.updateBy= req.user.id
    req.body.updatedBy= req.user.id
     //await coupon.save()
     await couponModel.updateOne({_id:req.params.couponId },req.body ,{new:true})

   return  res.status(200).json({message:"Done ",coupon})

}