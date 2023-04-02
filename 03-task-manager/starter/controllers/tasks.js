const Task = require('../models/Task')
const asyncWrapper = require('../middlewares/async')
const {createCustomError} = require('../errors/custom-error')

const getAllTasks = asyncWrapper (
    async (req, res) => {
        const tasks = await Task.find({});
        return (res.status(200).json({tasks}))
    }
)

const createTask = asyncWrapper (
    async (req, res) => {
        const task = await Task.create(req.body)
        return(res.status(201).json({task}));
    }
)

const getSingleTask = asyncWrapper(
    // we get next here in our controller from our asyncWrapper middleware
    async (req, res, next) => {
        const {id:taskId} = req.params;
            const task = await Task.findOne({_id: taskId})
            if(!task) {
                return next(createCustomError(`No task found with id: ${taskId}`, 404))
            }
             res.status(200).json({task})
    }
)

const updateTask = asyncWrapper(
    async (req, res, next) => {
        const {id:taskId} = req.params;
            const task = await Task.findOneAndUpdate({_id: taskId}, req.body, {new:true, runValidators: true})
            if(!task) {
                return next(createCustomError(`No task found with id ${taskId}`, 404))
            }
            res.status(200).json({task})
    }
)

const deleteTask = asyncWrapper(
    async (req, res, next) => {
        const {id: taskId} = req.params;
            const task = await Task.findOneAndDelete({_id: taskId})
            if(!task) {
                return next(createCustomError(`No task found with id ${taskId}`, 404))
            }
            return res.status(200).json({success: true, msg: "delete successful"})
    }
)

module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask
}