const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const Token = require('../models/Token')
const { attachMultipleCookiesToResponse} = require('../utils');

const authenticateUser = async (req, res, next) => {
  const {refreshToken, accessToken} = req.signedCookies;

  try {
    if(accessToken) {
      const payload = isTokenValid(accessToken)
      req.user = payload.user
      console.log("access token has NOT expired")
      return next()
    }
    // IF ACCESS TOKEN HAS EXPIRED
    console.log("access token has expired")
    const payload = isTokenValid(refreshToken)
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken
    })
    
    // IF REFRESH TOKEN HAS ALSO EXPIRED
    if(!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid. Please re-login');
    }
    // CREATE ACCESS JWT AND REFRESH JWT AGAIN
    attachMultipleCookiesToResponse({res: res, user: payload.user, refreshToken: payload.refreshToken})
    req.user = payload.user
    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
