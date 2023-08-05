import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import productModel from "../../../../DB/model/Product.model.js";
import {  productType } from "./product.types.js";
import { graphQLValidation } from "../../../middleware/validation.middleware.js";
import { graphQlupdateStock } from "../product.validation.js";
import { graphAuth, roles } from "../../../middleware/auth.middleware.js";




export const products ={
    type: new GraphQLList(productType),
    resolve:async()=>{
        const productList= await productModel.find().populate("brandId")
        return productList
    }
}

export const updateStock = {
    type: productType ,
    args:{
        id:{type:new GraphQLNonNull(GraphQLID)},
        stock:{type:new GraphQLNonNull(GraphQLInt)},
        authorization:{type:new GraphQLNonNull(GraphQLString)},

    },
    resolve:async(parent , args)=>{
       await  graphQLValidation ( graphQlupdateStock,args)
       await  graphAuth(args.authorization,[roles.user])
        const {id,stock} =args
        const product= await productModel.findByIdAndUpdate({_id:id},{stock},{new:true})
        return product
    }
}