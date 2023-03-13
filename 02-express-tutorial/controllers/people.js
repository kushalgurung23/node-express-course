const getPeople = (req, res) => {
    res.status(200).json({success: true, data: people});
}

const createPeople = (req, res) => {
    console.log(req.body);
    const {name} = req.body;
    if(name) {
        return (res.status(201).send({success: true, person: name}));
    }
    else {
        return (res.status(400).json({success: false, msg: "please provide name"}));
    }
    
}

const createPeoplePostman = (req, res) => {
    console.log(req.body);
    const {name} = req.body;
    if(name) {
        return(res.status(201).json({success: true, data: [...people, {"name": name}]}));
    }
    else {
       return(res.status(400).json({success:false, msg: "Provide name"}));
    }
    
}

const changePeopleDetails = (req, res) => {
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
}

const deletePeople =  (req, res) => {
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
}

module.exports = {getPeople, createPeople, createPeoplePostman, changePeopleDetails, deletePeople}