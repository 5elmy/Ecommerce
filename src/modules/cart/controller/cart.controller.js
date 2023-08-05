import cartModel from "../../../../DB/model/Cart.model.js";
import productModel from "../../../../DB/model/Product.model.js";



export const addCart= async (req,res,next)=>{
    const {productId , quantity} = req.body;
    const product = await productModel.findById(productId);
    if(!product)
    {
        return next (new Error('in-valid product id',{cause:400}))
    } 

    if(quantity > product.stock || product.isDeleted)
    {
        await productModel.updateOne({_id:productId} , { $addToSet:{wishUser:req.user.id}})
        return next (new Error('in-valid quantity ',{cause:400}))
    }

 //check cart  if not cart we create cart and user have only one cart
    const cart = await cartModel.findOne({ createdBy:req.user.id })
    if(!cart)
    {
        //create one 
        const newCart = await cartModel.create({
            createdBy:req.user.id,
            products:[{
                productId,
                quantity
            }],    
        })
        return res.status(201).json({message:"Done" ,Cart: newCart})

    }
    // update cart item
    let matchProduct=false
    for (let i = 0; i < cart.products.length; i++) {
        if(cart.products[i].productId.toString() == productId)
        {
            cart.products[i].quantity = quantity
            matchProduct=true
            break ;
        }
        
    } 
    //or push in product
    
    if(!matchProduct)
    {
        cart.products.push({productId,quantity})
    }
    await cart.save()

    return res.status(201).json({message:"Done" ,Cart:cart})

}

  export async function clearAllCartItems(createdBy)
  {
   const cart = await cartModel.updateOne({ createdBy},{products:[]});
    return cart
  }
        

export const clearCart = async (req,res,next)=>{
    // await cartModel.updateOne({ createdBy:req.user.id },{products:[]});
    await clearAllCartItems(req.user.id)
    return res.status(200).json({message:"Done" })

}

export async function deletedSelectItems(productIds , createdBy){
    const cart=  await cartModel.updateOne({createdBy},
            {
                $pull:
                {
                    products:
                    {
                        productId:{
                            $in:productIds
                        }
                    }
                }
            })
            return cart ;
}


export const clearItemsFromCart=async(req,res,next)=>{
     //clear selected product from cart
     const {productIds}= req.body;
    const cart= await deletedSelectItems(productIds,req.user.id)

    return res.status(200).json({message:"Done"})
  

}
