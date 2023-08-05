
import { Schema, Types, model } from "mongoose";


const userSchema = new Schema({
    firstName:String,
    secondName:String,
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [25, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin','HR','Manager']
    },
    status:{
        type: String,
        default:"not active",
        enum:["active","not active" , "blocked"]
     },
    // isBlocked:{
    //     type:Boolean,
    //     default:false
    // }
    forgetPasswordCode:{
        type:Number,
        default:null
    }
    , 
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    image: Object,
    DOB: String,
    address:String,
    changePasswordTime:Date,
    wishList:[{type:Types.ObjectId , ref:"Product"}],
    isDeleted: { type: Boolean, default: false },

},
{
    timestamps: true
})

userSchema.post("find",function(){
   console.log( this.where({isDeleted:false}))
    
})


const userModel = model('User', userSchema)
export default userModel