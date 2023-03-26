const {BadRequestError} = require('../errors')
const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')

const login  = async (req, res) => {
   const {username, password} = req.body;
   if(!username || !password) {
    throw new BadRequestError('Please provide both email and password')
   }

   const id = new Date().getDate()
   const token = jwt.sign({
    id,
    username
   }, process.env.JWT_SECRET,
   {expiresIn: '30d'})

    res.status(200).json({msg: 'User created', token})
}

const dashboard = async (req, res) => {
    const {id, username } = req.user;
    const luckyNumber = Math.floor(Math.random() * 100)
    res.status(StatusCodes.OK).json({msg: `Hello, ${username}`, secret: `Here is your authorized data. Your lucky number is ${luckyNumber}`})
} 

module.exports = {
    login,
    dashboard
}