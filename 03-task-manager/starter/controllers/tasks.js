const getAllTasks = (req, res) => {
    res.json({success: true, msg: "Get all task"})
}

const createTask = (req, res) => {
    res.json(req.body)
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