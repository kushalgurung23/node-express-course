const Task = require('../models/Task')
const Book = require('../models/Book')

const getAllTasks = (req, res) => {
    res.json({success: true, msg: "Get all task"})
}

const createTask = async (req, res) => {
    // const task = await Task.create({name: "Bottle", completed: true})
    const task = await Task.create(req.body)
    return(res.json({task}));
}

const getSingleTask = (req, res) => {
    const { id } = req.params;
    res.send(`id is ${id}`)
}

const updateTask = (req, res) => {
    res.send('update tasks')
}

const deleteTask = (req, res) => {
    res.send('delete task')
}

module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask
}