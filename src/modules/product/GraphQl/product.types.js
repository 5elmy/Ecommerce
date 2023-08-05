import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { brandType } from "../../brand/GraphQl/types.js";


export function imageType(name)
{
  return  new GraphQLObjectType({
        name: name || "mainImage",
        description:"image",
        fields:{
            secure_url:{type:GraphQLString},
            public_id:{type:GraphQLString}
        }
    })

}

const image = imageType()

export const productType= new GraphQLObjectType({
    name:"Generalobject",
    description:"object",
    fields:{
        _id:{type:GraphQLID},
        name:{type:GraphQLString},
        slug:{type:GraphQLString},
        description:{type:GraphQLString},
        stock:{type:GraphQLInt},
        price:{type:GraphQLFloat},
        finalPrice:{type:GraphQLFloat},
        totalFinalPrice:{type:GraphQLFloat},
        discount:{type:GraphQLFloat},
        categoryId:{type:GraphQLID},
        subCategoryId:{type:GraphQLID},
        brandId:{type:brandType},
        colors:{type:new GraphQLList(GraphQLString)},
        size:{type:new GraphQLList(GraphQLString)},

        mainImage:{type:image}
    }
})





