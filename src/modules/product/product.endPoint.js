import { roles } from "../../middleware/auth.middleware.js";




export const endPoint={
    wishList:[roles.user],
    createProduct:[roles.admin],
    updateProduct:[roles.admin],
    deleteProduct:[roles.admin],
    getProduct   :[roles.admin],
}