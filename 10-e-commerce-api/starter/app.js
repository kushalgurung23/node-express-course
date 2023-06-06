require('dotenv').config()
require('express-async-errors')

 const express = require('express')
 const app = express()

 const morgan = require('morgan')

 const cookieParser = require('cookie-parser')
 const fileUpload = require('express-fileupload')
 const rateLimiter = require('express-rate-limit')
 const helmet = require('helmet')
 const xss = require('xss-clean')
 const cors = require('cors')
 const mongoSanitize = require('express-mongo-sanitize')

// database
const connectDB = require('./db/connect')

// middleware
const notFoundMiddleware = require('./middleware/not-found')

const errorHandlerMiddleware = require('./middleware/error-handler')

// routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')

app.set('trust proxy', 1)
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 60
    })
)

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

// morgan package helps to send information like type of request, status code, time took to complete request, etc.
app.use(morgan('tiny'))
app.use(express.json())
// Signing cookie
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())

app.get('/', (req, res) => {
    res.send('e-commerce');
})

app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies);
    res.send('e-commerce');
})

// ROUTES
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`Server is listening on port ${port}`));
    }
    catch (err) {
        console.log(err);
    }
}

start();