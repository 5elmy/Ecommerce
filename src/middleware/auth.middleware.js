import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";


export const roles ={
    admin:"Admin",
    user:"User",
    HR:"HR"
}
// console.log(Object.values(roles)) to convert values of object to array 
// output is [ 'Admin', 'User', 'HR' ]
const auth = (accessRole =[])=>
{
    return asyncHandler( async (req, res, next) => {
 
        const { authorization } = req.headers;

        if(!authorization)
        {
            return next ( new Error("In-valid authorization ",{cause:400} ))

        }
       
        if (!authorization.startsWith(process.env.BEARER_KEY)) {
            return next ( new Error("In-valid authorization  bearer key",{cause:400} ))
        }
        const token = authorization.split(process.env.BEARER_KEY)[1]
      
        if (!token) {
            return next ( new Error("In-valid token",{cause:400} ))
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
        if (!decoded?.id) {
            return next ( new Error("In-valid token payload",{cause:400} ))
          
        }
        const authUser = await userModel.findById(decoded.id).select('userName email role image status changePasswordTime')


        if(parseInt(authUser.changePasswordTime?.getTime() / 1000) > decoded.iat )  //it's mean token is old (user make update or forget password or update email) 
        {
        //  console.log({changePasswordTime: parseInt(authUser.changePasswordTime.getTime() / 1000) , token_time : decoded.iat})

            return next ( new Error(" expired token ...",{cause:400} )) 
           
        }
        if (!authUser) {
            return next ( new Error("Not register account",{cause:400} )) 
        }
        if(authUser.status == "blocked")
        {
            return next ( new Error("Blocked  account.. ",{cause:400} )) 
        }

        if(!accessRole.includes(authUser.role))
        {
            return next ( new Error("Not authorized account.. ",{cause:400} )) 
        }

        req.user = authUser;
        return next()
   
}
)
}
export const graphAuth = async(authorization,accessRole =[])=>
{
try {
    if(!authorization)
    {
        throw new Error("In-valid authorization ")

    }
    if (!authorization.startsWith(process.env.BEARER_KEY)) {
       throw Error("In-valid authorization  bearer key")
    }
    const token = authorization.split(process.env.BEARER_KEY)[1]
  
    if (!token) {
      throw Error("In-valid token" )
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
    if (!decoded?.id) {
        throw Error("In-valid token payload")
      
    }
    const authUser = await userModel.findById(decoded.id).select('userName email role image status changePasswordTime')
    if(parseInt(authUser.changePasswordTime?.getTime() / 1000) > decoded.iat )  //it's mean token is old (user make update or forget password or update email) 
    {
    //  console.log({changePasswordTime: parseInt(authUser.changePasswordTime.getTime() / 1000) , token_time : decoded.iat})

        throw Error(" expired token ...") 
       
    }
    if (!authUser) {
         throw Error("Not register account") 
    }
    if(authUser.status == "blocked")
    {
        throw Error("Blocked  account.. ") 
    }

    if(!accessRole.includes(authUser.role))
    {
        throw Error("Not authorized account.. ") 
    }

   let user = authUser;
    return user
} catch (error) {
    throw Error(error) 

}
   
}


export default auth