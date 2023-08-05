
import authRouter from './modules/auth/auth.router.js'
import branRouter from './modules/brand/brand.router.js'
import cartRouter from './modules/cart/cart.router.js'
import categoryRouter from './modules/category/category.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import orderRouter from './modules/order/order.router.js'
import productRouter from './modules/product/product.router.js'
import reviewsRouter from './modules/reviews/reviews.router.js'
import subcategoryRouter from './modules/subcategory/subcategory.router.js'
import userRouter from './modules/user/user.router.js'
import connectDB from '../DB/connection.js'
import morgan from 'morgan'
import cors from "cors"
import { globalErrorHandling } from './utils/errorHandling.js'
import { graphqlHTTP } from 'express-graphql'
import productSchema from './modules/product/GraphQl/schema.js'




const initApp = (app, express) => {

    // start cors origin //  localالكلام دا بيشتغل لما بيكون ال اما مرفوعين او  
    //   بيحصل مشاكل offline والتاني online لو واحد 
//     let whitelist = ['http://localhost:3000/product/', 'http://localhost:5200/product/']
//     let corsOptions = {
//    origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//         } else {
//         callback(new Error('Not allowed by CORS'))
//         }
//     }
// }


    // app.use(cors(corsOptions))
     app.use(cors())

    //finish cors origin

    if(process.env.MOOD =='DEV')
    {
    app.use(morgan('dev'))
    }
    else{
    //app.use(morgan('combined'))
    app.use(morgan('common'))

    }
    //convert Buffer Data
    app.use(express.json({}))
    //GraphQl
    app.use("/GraphQl",graphqlHTTP({
        schema: productSchema,
        graphiql:true
    }))
    //Setup API Routing 
    app.use(`/auth`, authRouter)
    app.use(`/user`, userRouter)
    app.use(`/product`, productRouter)
    app.use(`/category`, categoryRouter)
    app.use(`/subCategory`, subcategoryRouter)
    app.use(`/reviews`, reviewsRouter)
    app.use(`/coupon`, couponRouter)
    app.use(`/cart`, cartRouter)
    app.use(`/order`, orderRouter)
    app.use(`/brand`, branRouter)

    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    app.use(globalErrorHandling)
    connectDB()

}



export default initApp