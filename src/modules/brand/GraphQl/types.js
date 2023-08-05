import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { imageType } from "../../product/GraphQl/product.types.js";



export const brandType= new GraphQLObjectType({
    name:"brandobject",
    description:"object12",
    fields:{
        _id:{type:GraphQLID},
        name:{type:GraphQLString},
        slug:{type:GraphQLString},
        image:{type:imageType("brandImage")}
    }
})
