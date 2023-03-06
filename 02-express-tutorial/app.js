const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log('hit resource');
    res.status(200).send('Home page');
});

app.get('/about', (req, res) => {
    res.status(200).send('ABOUT PAGE');
});

app.all('*', (req, res) => {
    res.status(404).send('<h1>resource not found</h1>')
});

app.listen(3000, () => {
    console.log("3000 server has started");
});

// 5:03:11
// npm install express@4.17.1 --save

// app.get
// app.post
// app.put
// app.delete
// app.all
// app.use
// app.listen