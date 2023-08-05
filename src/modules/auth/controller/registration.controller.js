import userModel from "../../../../DB/model/User.model.js";
import sendEmail from "../../../utils/email.js";
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import Html_confirmEmail from "../../../utils/templateEmail.js"
import { customAlphabet } from 'nanoid'

// export const  signUp = asyncHandler(async(req,res,next)=>{
//     const {userName, email, password } = req.body;
//     const checkUser= await userModel.findOne({email});
//     if(checkUser)
//     {
//         return next(new Error("Email Exist.... ",{cause:400}))
//     }
//     const token= generateToken({ payload:{email}, signature:process.env.email_Token, expiresIn:60*60})

//       const link = `${req.protocal}://${req.headers.host}:5000/auth/confirmEmail/${token}`
      
//      const html = `<a href=${link}>Click Here to confirm email</a>`
//     const info = await sendEmail({to:email ,subject:"Confirm Email ",html})
//     if(!info)
//     {
//         return next(new Error("rejected email",{cause:400}))
//     }
//     const hashPasssword= hash({plaintext:password });
//     const user =await userModel.create({
//         userName,
//         email,
//         password:hashPasssword
//     })
//     return res.status(201).json({message:"Done",user:user._id})
// })

// export const confirmEmail= async(req,res,next)=>{
//     const  {token}= req.params;
//      const {email}= verifyToken({token,signature:process.env.email_Token});
//      const user= await userModel.findOneAndUpdate({email},{confirmEmail:true},{new :true});
//      return res.status(200).json({message:"Done",user}) 
// }



export const getusers =async(req,res,next)=>{

    const users = await userModel.find({})
    return  res.json({message:"Done" , users})
}

export const signUp =async(req,res,next)=>{
  const {userName , email , age , password}= req.body
  const checkUser =await userModel.findOne({email})
  if(checkUser)
  {
    return next (new Error('Email Areadly Exist... ', {cause:409}) )
  }
  //confirm email 
  const token = generateToken({payload:{email},signature:process.env.CONFIRM_EMAIL_SIGNTURE ,expiresIn:60*30})
  const refresh_token = generateToken({payload:{email},signature:process.env.CONFIRM_EMAIL_SIGNTURE ,expiresIn:60*60*24*30})
  const link= `http://localhost:5000/auth/confirmEmail/${token}`
  const refreshlink= `http://localhost:5000/auth/newconfirmEmail/${refresh_token}`
   
   const html =Html_confirmEmail(link,refreshlink)

  const subject = "Confirm Email..."
  const info = await sendEmail({to:email ,subject:subject , html:html})

  if(!info)
  {
    return next (new Error("Rejected Email " , {cause:400}))
  }
    const hashPassword = hash({plaintext:password })
    const createUser = await userModel.create({userName , email , age , password:hashPassword})
    return  res.status(201).json({message:"User added successfully" , createUser})
}

//confirmEmail
export const confirmEmail =async(req,res,next)=>{
  const token = req.params.token;

  const {email} = verifyToken({token:token ,signature:process.env.CONFIRM_EMAIL_SIGNTURE});

  const user = await userModel.updateOne({email:email ,confirmEmail:false },{confirmEmail:true},{new:true});
  return user.modifiedCount? res.status(200).send('Go to login  ') : 
                                                                                        next (new Error("not register account",{cause:400})) 
 
}
//new confirm Email
export const newConfirmEmail = async (req,res,next)=>{
  const token = req.params.token;
  const{ email} = verifyToken({token:token ,signature:process.env.CONFIRM_EMAIL_SIGNTURE})
  const newToken= generateToken({payload:{email} , signature:process.env.CONFIRM_EMAIL_SIGNTURE ,expiresIn:60*1})
  const link= `http://localhost:5000/auth/confirmEmail/${newToken}`
  const refeshlink= `http://localhost:5000/auth/confirmEmail/${token}`
  const html= `<a href=${link}>click here to new confirm email</a> 
               <br><br><br><br>  
               <a href=${refeshlink}>click here to refresh confirm email</a>`
  const info= await sendEmail({to:email ,subject:"New Confirm Email" ,html})
  if(!info)
  {
    return next (new Error("Rejected Email " ,{cause:400}))

  }
  return res.status(200).send("Done please check your email")
}

//login
export const login = async (req,res,next)=>{
    const {email,password}= req.body;
  const user =await userModel.findOne({email})
  if(!user )  
  {
    return next (new Error(' Not register account',{cause:404}))
  }
  if( !user.confirmEmail )   
 
  {
    return next (new Error('please confirm email first..',{cause:400}))
  }

 
  const match = compare({plaintext:password ,hashValue:user.password })
 
  if(!match )
  {
    return next(new Error("in-valid password",{cause:400}))
  }
  user.status="active"
  await user.save();

  const token= generateToken({payload:{id:user._id , email:user.email ,role:user.role },expiresIn:60*30})
  const refresh_Token= generateToken({payload:{id:user._id , email:user.email ,role:user.role},expiresIn:60*60*24*365})
  return res.status(202).json({ message: "Logged in successfully" , access_token : token ,access_refresh_Token:refresh_Token }); 
}
//forget password

export const forgetPassword = async(req,res,next)=>{
  const {email}=req.body;

  const nanoid = customAlphabet('1234567890', 10)
  let code  = nanoid(4) 

  const user= await userModel.findOneAndUpdate({email}, {forgetPasswordCode:code})
  if(!user)
  {
    return next(new Error("not register account",{cause:400}))
  }
 

  const html =`<p>${code}</p>`
  const info = sendEmail({to:email ,subject:"Forget  Password ", html})
  if(!info)
  {
    return next (new Error("Rejected Email " ,{cause:400}))
  }
  return res.status(200).json({message:"check your email"})
}

export const resetPassword =async(req,res,next)=>{
 
  const {password ,code , email} =req.body
   const user= await userModel.findOne({email})
   if(!user)
   {
     return next(new Error("in-vaild  account",{cause:400}))
   }
   if(user.forgetPasswordCode != parseInt(code))
   {
     return next(new Error("in-vaild reset code...",{cause:400}))
   }
  const hashPassword= hash({plaintext:password})
  user.password= hashPassword;
  user.forgetPasswordCode= null;
  user.changePasswordTime=Date.now()
  await user.save();
  return  res.status(200).json({message:"success reset Password",user}) ;
}

