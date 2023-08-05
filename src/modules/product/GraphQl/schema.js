import { GraphQLObjectType, GraphQLSchema } from "graphql";
 import { products, updateStock } from "./fields.js";


const productSchema =  new GraphQLSchema({
    query: new GraphQLObjectType({
        name:"productGraphQl",
        description:" Handile  Product GraphQl Api",
        fields:{
            products:products
        }
    }),
    mutation: new GraphQLObjectType({
        name:"productMutation",
        description:" Handile  Product GraphQl Api",
        fields:{
            updateStock:updateStock
        }
    })
})


export default productSchema