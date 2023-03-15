const express = require('express')
const app = express();
const tasks = require('./routes/tasks')
const connectDB = require('./db/connect')
require('dotenv').config()

// middlewares
app.use(express.json())

// routes
app.use('/api/v1/tasks', tasks);

app.get('/hello', (req, res) => {
    res.send('task manager app');
})

const port = 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => { 
            console.log("Server 3000 has started");
        })
    }
    catch(error) {
        console.log(error);
    }
}

start()

// 1:36:30