const mongoose = require('mongoose')

const BookSchema = mongoose.Schema({
    name:String, cost: Number
});

module.exports = mongoose.model('testBook', BookSchema)