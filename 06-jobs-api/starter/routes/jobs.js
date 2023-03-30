const express = require('express')
const router = express.Router()
const {getAllJobs,
    getOneJob,
    createAJob,
    updateJob,
    deleteJob
    } = require('../controllers/jobs')

router.route('/').get(getAllJobs).post(createAJob)
router.route('/:id').get(getOneJob).patch(updateJob).delete(deleteJob)

module.exports = router