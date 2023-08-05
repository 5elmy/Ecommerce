import { roles } from "../../middleware/auth.middleware.js";




export const endPoint={
    create:[roles.user],
    update:[roles.user],
    delete:[roles.user],
    get   :[roles.user],
    cancel:[roles.user],
    delivered:[roles.admin],
}