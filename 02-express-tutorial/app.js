const express = require('express');
const app = express();
const {people} = require('./data.js')

// static assets
app.use(express.static('./methods-public'))
// parse form data
app.use(express.urlencoded({extended: false}))
// parse json
app.use(express.json())

app.get('/api/people', (req, res) => {
    res.status(200).json({success: true, data: people});
})

app.post('/login', (req, res) => {
    console.log(req.body);
    const {name} = req.body;
    if(name) {
        return res.status(200).send(`WELCOME ${name}`);
    }

    return res.status(401).send("Please provide credentials");
})

app.post('/api/people', (req, res) => {
    console.log(req.body);
    const {name} = req.body;
    if(name) {
        return (res.status(201).send({success: true, person: name}));
    }
    else {
        return (res.status(400).json({success: false, msg: "please provide name"}));
    }
    
})

app.post('/api/postman/people', (req, res) => {
    console.log(req.body);
    const {name} = req.body;
    if(name) {
        return(res.status(201).json({success: true, data: [...people, {"name": name}]}));
    }
    else {
       return(res.status(400).json({success:false, msg: "Provide name"}));
    }
    
});

app.put('/api/postman/people/:id', (req, res) => {
    const {id} = req.params;
    const {name} = req.body;

    if(!id || !name) {
        return(res.status(400).json({success: false, msg: "provide id and name"}));
    }
    const onePerson = people.find((data) => {
        return data.id === Number(id);
    });
    if(!onePerson) {
        return (res.status(404).json({success: false, msg: "People not found"}));
    }
    const newPeople = people.map((data) => {
        if(data.id === onePerson.id) {
            data.name = name;
        }
        return data;
    })
    return(res.status(200).json({success: true, data: newPeople}))
})

app.delete('/api/postman/people/:id', (req, res) => {
    const {id} = req.params;
    if(!id) {
        return(res.status(400).json({success: false, msg: "provide id to delete"}));
    }
    const onePerson = people.find((data) => {
        return data.id === Number(id);
    });
    if(!onePerson) {
        return (res.status(404).json({success: false, msg: "People not found"}));
    }
    const newPeople = people.filter((person) => {
       return person.id !== Number(id);
    })
    return(res.status(200).json({success: true, data: newPeople}));
})

app.all('*', (req, res) => {
    res.send('no data found');
})

app.listen(3000, () => {
    console.log("3000 server has started");
});

// 7:50:18