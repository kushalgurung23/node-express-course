const customError = require('../errors')

// requestUser is the searchedBy user
// resourceUserId is searchedTo user
// resourceUserId is the data type of resourceUserId which will be object

// { name: 'foden', userId: '646dcf35cd23b474407f9abc', role: 'user' }
// new ObjectId("646d86082ac09188b07c16c1")
// object

// requestUser is the user that logged in
// resourceUserId is the user that we might want to check, if logged in user is not admin or owner
const checkPermissions = (requestUser, resourceUserId) => {
    if(requestUser.role === 'admin' || requestUser.role === 'owner') return;
    if(requestUser.userId === resourceUserId.toString()) return
    throw new customError.UnAuthorizedError('Not authorized to access this route.')
}

module.exports = checkPermissions