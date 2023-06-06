const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const jwt = require('jsonwebtoken')
const {attachCookiesToResponse, createTokenUser} = require('../utils')

const registerUser = async (req, res) => {
    const {email, name, password} = req.body;
    if(!email || !password || !name) {
        throw new CustomError.BadRequestError('Please provide all details');
    }
    const emailAlreadyExists = await User.findOne({email});
    if(emailAlreadyExists) {
        throw new CustomError.BadRequestError('Email already exists');
    }

    // First registered user is an admin
    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({name, email, password, role})

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res: res, user: tokenUser})
    res.status(StatusCodes.CREATED).json({user: tokenUser})
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new CustomError.BadRequestError('Please provide both email and password');
    }
    const user = await User.findOne({email});
    if(!user) {
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(StatusCodes.OK).json({user: tokenUser})
}

const logoutUser = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly:true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({msg: 'user is logged out.'})
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}
