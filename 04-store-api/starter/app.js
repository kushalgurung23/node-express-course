require('dotenv').config()
const productsRouter = require('./routes/products')

// async errors
require('express-async-errors')

const express = require('express')
const app = express();

const connectDB = require('./db/connect')

const errorHandlerMiddleware = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')

// middleware
app.use(express.json())

app.get('/', (req, res) => {
    return res.send('<h1>Store API</h1><a href = "/api/v1/products">Products route</a>')
})

app.use('/api/v1/products', productsRouter)

app.use(errorHandlerMiddleware)
app.use(notFound)

const port = process.env.PORT || 3000;

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Started listening to port ${port}`);
        })
    }
    catch(error) {
        console.log(error);
    }
}

start()

// 4:50:02