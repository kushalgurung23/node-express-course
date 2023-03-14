require('./db/connect')
const express = require('express')
const app = express();
const tasks = require('./routes/tasks')

// middlewares
app.use(express.json())

// routes
app.use('/api/v1/tasks', tasks);

app.get('/hello', (req, res) => {
    res.send('task manager app');
})

const port = 3000;

app.listen(3000, () => {
    console.log("Server 3000 has started");
})

// 1:03:44