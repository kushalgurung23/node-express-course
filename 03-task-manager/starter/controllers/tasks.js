const Task = require('../models/Task')
const Book = require('../models/Book')

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        return (res.status(200).json({tasks}))
    }
    catch(error) {
        return res.status(500).json({success: false, msg: error})
    }
    
}

const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body)
    return(res.json({task}));
    }
    catch(error) {
        return res.status(500).json({success: false, msg: error})
    }
}

const getSingleTask = async (req, res) => {
    try {
       const {id:taskId} = req.params;
        const task = await Task.findOne({_id: taskId})
        if(!task) {
            return res.status(404).json({success: false, msg: "task not found"})
        }
         res.status(200).json({task})
    }
   catch(error) {
    return res.status(500).json({success: false, msg: error})
   }
}

const updateTask = async (req, res) => {
    try {
        const {id:taskId} = req.params;
        const task = await Task.findOneAndUpdate({_id: taskId}, req.body, {new:true, runValidators: true})
        if(!task) {
            return res.status(404).json({success: false, msg: "Task not found"})
        }
        res.status(200).json({task})
    }
    catch(error) {
        return res.status(500).json({success: false, msg: error})
    }
   
}

const deleteTask = async (req, res) => {
    try {
        const {id: taskId} = req.params;
        const task = await Task.findOneAndDelete({_id: taskId})
        if(!task) {
            return res.status(404).json({success: false, msg: "delete fail"})
        }
        return res.status(200).json({success: true, msg: "delete successful"})
    }
    catch(error) {
        return res.status(500).json({success: false, msg: error})
    }
}

module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask
}