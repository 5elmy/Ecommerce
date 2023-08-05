import { roles } from "../../middleware/auth.middleware.js";




export const endPoint={
    create:[roles.admin],
    update:[roles.admin],
    delete:[roles.admin],
    get   :[roles.admin],
}