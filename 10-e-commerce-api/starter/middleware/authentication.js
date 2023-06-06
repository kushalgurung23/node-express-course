const CustomError = require('../errors')
const {isTokenValid} = require('../utils')

const authenticateUser = (req, res, next) => {
    const token = req.signedCookies.token;
    
    if(!token) {
       throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
    try {
        const {name, userId, role} = isTokenValid({token: token})
        req.user = {name, userId, role}
        next();
    }
    catch(err) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
}

// "..."" REST PARAMETER puts all values in a single array
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            throw new CustomError.UnAuthorizedError('Unauthorized to access this route')
        }
        next()
    }
}

module.exports = {authenticateUser, authorizePermissions}