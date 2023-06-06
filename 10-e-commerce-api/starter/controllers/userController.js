const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors/')
const User = require('../models/User');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils');
const { token } = require('morgan');

const getAllUser = async (req, res) => {
    const user = await User.find({role: 'user'}).select('-password')
    res.status(StatusCodes.OK).json({user})
}

const getSingleUser = async (req, res) => {
    const user = await User.findOne({_id: req.params.id}).select('-password')
    if(!user) {
        throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`)
    }
    // authorization check
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user})
}

// UPDATE WITH user.save()
const updateUser = async (req, res) => {
    const {name, email} = req.body;
    if(!name || !email) {
        throw new CustomError.BadRequestError('Please provide both email and password')
    }
    const user = await User.findOne({_id: req.user.userId})
    user.email = email;
    user.name = name;
    await user.save();

    if(!user) {
        throw new CustomError.UnAuthorizedError('Could not update the user details')
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(StatusCodes.OK).json({user: tokenUser })
}

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both values')
    }

    const user = await User.findOne({_id: req.user.userId})
    if(!user) {
        throw new CustomError.UnAuthorizedError('User is not found')
    }
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if(!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg: "Success! Password updated."})
}

module.exports = {
    getAllUser,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}

// USER SAVE WITH FINDONEANDUPDATE()

// const updateUser = async (req, res) => {
//     const {name, email} = req.body;
//     if(!name && !email) {
//         throw new CustomError.BadRequestError('Please provide details you want to change')
//     }
//     const user = await User.findOneAndUpdate({_id: req.user.userId},
//       {email, name},
//       {new: true, runValidßators: true}  
//         )
//     if(!user) {
//         throw new CustomError.UnAuthorizedError('Could not update the user details')
//     }
//     const tokenUser = createTokenUser(user)
//     attachCookiesToResponse({res, user: tokenUser})
//     res.status(StatusCodes.OK).json({user: tokenUser })
// }