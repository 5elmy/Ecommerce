import orderModel from "../../../../DB/model/Order.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";




export const createReview = async(req,res,next)=>{
    const {productId}=req.params;
    const {rating, comment}= req.body
    const order= await orderModel.findOne({
        userId:req.user.id , 
        status:"delivered" , 
        "products.productId":productId})

    if(!order)
    {
        return next (new Error(`can't review product before received it`,{cause:400}))
    }
    if(await reviewModel.findOne({productId, orderId:order._id , createdBy:req.user.id}))
    {
        return next (new Error(`Already reviewed by you`,{cause:400}))

    }

    await reviewModel.create({createdBy:req.user.id , productId , orderId:order._id , rating , comment})
    return res.status(201).json({message:"Done"})
}


export const updateReview = async(req,res,next)=>{
    const {productId,reviewId}=req.params;
    const review = await reviewModel.findOneAndUpdate({_id:reviewId, productId , createdBy:req.user.id}, req.body)
    if(!review)
    {
        return next (new Error(`in-vaild review id`,{cause:400}))
    }
        return res.status(200).json({message:"Done"})
}