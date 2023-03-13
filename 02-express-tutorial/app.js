const express = require('express');
const app = express();
const people = require('./routes/people')
const login = require('./routes/auth')

// static assets
app.use(express.static('./methods-public'))
// parse form data
app.use(express.urlencoded({extended: false}))
// parse json
app.use(express.json())
// people router
app.use('/api/people', people);

// login router
app.use('/login', login)


app.all('*', (req, res) => {
    res.send('no data found');
})

app.listen(3000, () => {
    console.log("3000 server has started");
});

// 8:05:48