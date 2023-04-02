const express = require('express')
const app = express();
const tasks = require('./routes/tasks')
const connectDB = require('./db/connect')
const notFound = require('./middlewares/not-found')
require('dotenv').config()
const errorHandlerMiddleware = require('./middlewares/error-handler')

// middlewares
app.use(express.static('./public'))  // HTML CSS JS FILES
app.use(express.json())  // convert res.body to json format

// routes
app.use('/api/v1/tasks', tasks);

// put below routes
app.use(notFound)  // app.use('*', (req, res) => {})   for routes that are not available
app.use(errorHandlerMiddleware)  // built-in express error handler for middlewares

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => { 
            console.log(`Server ${port} has started`);
        })
    }
    catch(error) {
        console.log(error);
    }
}

start()
