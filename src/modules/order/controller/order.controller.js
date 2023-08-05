import Stripe from "stripe";
import cartModel from "../../../../DB/model/Cart.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import sendEmail from "../../../utils/email.js";
import payment from "../../../utils/payment.js";
import { createInvoice } from "../../../utils/pdf.js";
import { clearAllCartItems, deletedSelectItems } from "../../cart/controller/cart.controller.js";



export const createOrder= async(req,res,next)=>{
    const {address,phone,couponName , note , paymentType}= req.body;
    let isCart= false
    if(couponName){
        const coupon = await couponModel.findOne({name:couponName.toLowerCase(),isDeleted:false , usedBy:{$nin:req.user.id}})
        if(!coupon )
        {
            return next (new Error ("in-valid coupon",{cause:400}))
        }
        if(Date.now() > coupon?.expire?.getTime() )
        {
            return next (new Error ("in-valid expire coupon",{cause:400}))
        }
        req.body.coupon= coupon
    }
    if(!req.body.products)
    {
      const cart = await cartModel.findOne({createdBy:req.user.id})
      if(!(cart?.products.length))
      {
          return next (new Error('Empty Cart...', {cause:400}))
      }
      req.body.products= cart.products
      isCart=true
    }
   
    let sumTotal= 0;
    let finalProductList=[]
    let productIds=[]

      
  for (let product of req.body.products) { //   نفسه product  بتاع ال   id  , quantity شايل ال  product  كل 
    const checkProduct= await productModel.findOne({
        _id:product.productId ,
        stock:{ $gte:product.quantity},
        isDeleted:false
    })
    if(!checkProduct)
    {
        return next(new Error (`fail to this product `,{cause:400}))
    }
    if(isCart==true)
    {
      product =product.toObject() //to convert product from json to object  // json   لما بتتخزن ف داتا بيز بتبقي عبارة عن  json عبارة عن   cart والي ف   cart علشان هي جاية من ال 

    }
    productIds.push(product.productId)
    product.name =checkProduct.name
    product.unitPrice /**  orderModel  دا الي ماسك حاجة ال product */=  checkProduct.finalPrice /**  productModel  دا الي ماسك حاجة ال checkproduct */
    product.finalPrice= product.unitPrice * product.quantity
    finalProductList.push(product)

    sumTotal += product.finalPrice
  }
  const order =await orderModel.create({
    userId:req.user.id,
    products:finalProductList,
    address,
    phone,
    note,
    couponId: req.body.coupon?._id,
    totalFinalPrice:Number.parseFloat(sumTotal - (sumTotal * ((req.body.coupon?.amount || 0)/100))).toFixed(2) ,
    paymentType,
    status: paymentType? "waitForPayment":"placed" 
  })
  if(!order)
  {
    return  next (new Error('in-vaild order',{cause:400}))
  }
  for (const product of req.body.products) {
    await productModel.updateOne({_id:product.productId},{$inc:{stock:-parseInt(product.quantity)}})
  }
  
  if(couponName)
  {
    await couponModel.updateOne({name:couponName},{$addToSet:{usedBy:req.user.id}})
  }

    if(!req.body.products)
    {
      
        await clearAllCartItems(req.user.id)
    }
    else
    {
      //clear selected product from cart
     
     await deletedSelectItems(productIds,req.user.id)


    }

    

  const invoice = {
    shipping: {
      name: req.user.userName,
      address: order.address,
      city: "Cairo ",
      state: "Nasr City",
      country: "Egypt",
      postal_code: 94111
    },
    items: order.products,
    subtotal:sumTotal ,
    paid:order.totalFinalPrice,
    invoice_nr: order._id,
    date:order.createdAt
  };



createInvoice(invoice,"invoice.pdf")

await sendEmail({to:req.user.email ,subject:"invoice", attachments:[{
  path:"invoice.pdf",
  contentType:"application/pdf"
}]})

 //start payment 
  if(paymentType == "card")
  {
    const stripe = new Stripe(process.env.STRIPE_KEY)
    if(req.body.coupon)
    {
      const coupon = await stripe.coupons.create({percent_off:req.body.coupon.amount , duration:"once"})
      req.body.couponId = coupon.id
    }
    const session = await payment ({
      stripe,
      payment_method_types:['card'],
      mode:"payment",
      cancel_url:`${req.protocol}://${req.headers.host}/order/payment/cancel?orderId=${order._id.toString()}`,
      customer_email:req.user.email,
      metadata: {
        orderId:order._id.toString()
      },
      line_items:order.products.map(product=>{
            return {
              price_data:{
                currency:"egp",
                product_data:{
                  name  : product.name
                },
                unit_amount:product.unitPrice *100,
              },
              quantity:product.quantity,
            }
      }),
      discounts:req.body.couponId ?[{coupon: req.body.couponId}]:[]
      

    })
    return res.status(201).json({message:"Done" ,order ,Url:session.url})

  } else
  {
    return res.status(201).json({message:"Done" ,order})

  }


}

export const cancelOrder= async(req,res,next)=>{
  const orderId= req.params.orderId;
  const reason = req.body.reason

  const order= await orderModel.findOne({_id:orderId, userId:req.user.id});
  if(!order)
  {
    return next (new Error('in-vaild order',{cause:400}))
  }
  if((order.status != "placed" & order.paymentType == "cash") ||(order.status != "waitForPayment" & order.paymentType == "card"))
  {
    return next (new Error(`cannot cancel your order after it been chanced to ${order.status} by the system`,{cause:400}))
  }
  
  const canceledOrder= await orderModel.updateOne({_id:orderId, userId:req.user.id},{status:"canceled" , reason})

  if(!canceledOrder.matchedCount)
  {
    return next (new Error(`fail to cancel your order`,{cause:400}))

  }
  for (const product of order.products) {
    await productModel.updateOne({_id:product.productId},{$inc:{stock:parseInt(product.quantity)}})
  }
  if(order.couponId)
  {
    await couponModel.updateOne({_id:order.couponId},{$pull:{usedBy:req.user.id}})
  }
  return res.status(200).json({message:" canseled is Done..."})
}

export const deliverOrder= async(req,res,next)=>{
  const orderId= req.params.orderId;


  const order= await orderModel.findOneAndUpdate(  
              {_id:orderId, status:{$nin:["rejected","delivered","canceled"]}},
              {status:"delivered" ,updatedBy:req.user.id});
  if(!order)
  {
    return next (new Error('in-vaild order',{cause:400}))
  }

  // if(["rejected","delivered","canceled"].includes(order.status))
  // {
  //   return next (new Error(`cannot delivered your order after it been chanced to ${order.status} `,{cause:400}))
  // }
  
 //  const deliveredOrder= await orderModel.updateOne({_id:orderId},{status:"delivered" ,updatedBy:req.user.id})

 
  return res.status(200).json({message:"  Done..."})
}
