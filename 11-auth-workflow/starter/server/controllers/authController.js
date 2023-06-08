const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachMultipleCookiesToResponse, createTokenUser, sendVerificationEmail, sendResetPasswordEmail, createHash } = require('../utils');
const crypto = require('crypto');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString('hex')
  // verificationToken will also be hashed in verifyEmail controller which is returned from query string. 
  const hashToken = createHash(verificationToken)

  const user = await User.create({ 
    name, email, password, role, verificationToken: hashToken});
  const origin = "http://localhost:3000"
  await sendVerificationEmail({
    name: user.name, 
    email: user.email, 
    // hashed verification token is saved in db, but original verification token will be passed as query string
    verificationToken: verificationToken,
    origin
  })
  
  // send verification token back only while testing in postman
  res.status(StatusCodes.CREATED).json({msg: 'Success! Please check your email'})
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  } 

  if(!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify your email')
  }

  const tokenUser = createTokenUser(user);

  // CREATE REFRESH TOKEN
  let refreshToken = '';

  // CHECK FOR EXISTING TOKEN
  const existingToken = await Token.findOne({user: user._id})

  // If already created before 
  if(existingToken) {
    const {isValid} = existingToken
    // USER will be unable to login when token is invalid, it can be done by admin
    if(!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    refreshToken = existingToken.refreshToken
    attachMultipleCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser});
    return;
  }

  // if logging in for the first time
  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = {refreshToken, ip, userAgent, user: user._id}
  await Token.create(userToken)

  attachMultipleCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser});
};

// IT WILL BE CALLED FROM FRONT-END, AS SOON AS THE URL GETS REDIRECTED
const verifyEmail = async (req, res)=> {
  const {verificationToken, email} = req.body;
  const user = await User.findOne({email});
  if(!user) {
    throw new CustomError.UnauthenticatedError('Verification failed')
  }
   // user.verificationToken is hashed already, so verificationToken received from query string is also hashed in order to check if both are equal
  if(user.verificationToken !== createHash(verificationToken)) {
    throw new CustomError.UnauthenticatedError('Verification failed')
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = '';
  await user.save()
  res.status(StatusCodes.OK).json({msg: "Email verified"})
}

const logout = async (req, res) => {
  console.log(req.user);
  await Token.findOneAndDelete({user: req.user.userId})
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const forgotPassword = async (req, res) => {
  const {email} = req.body
  if(!email) {
    throw new CustomError.BadRequestError('Please provide valid email')
  }
  const user = await User.findOne({email})
  if(user) {
    const passwordToken = crypto.randomBytes(70).toString('hex')
    const origin = "http://localhost:3000"
    // send email
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      // original password token is sent as query string in email. it will also be hashed while comparing with hashed password token from db later in resetPassword controller
      token: passwordToken,
      origin
    })
    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

    // hashing the password token before saving in db
    user.passwordToken = createHash(passwordToken)
    user.passwordTokenExpirationDate = passwordTokenExpirationDate
    await user.save()
  }
  res.status(StatusCodes.OK).json({msg: "Please check your email for reset password link"})
}

// IT WILL BE CALLED FROM FRONT-END, WHEN CLICKED ON LINK FROM EMAIL
const resetPassword = async (req, res) => {
  // password is provided by user
  // token and email is received from query parameter when clicked on link from email
  const {password, token, email} = req.body
  if(!email || !password || !token) {
    throw new CustomError.BadRequestError('Please provide all values')
  }
  const user = await User.findOne({email})
  if(user) {
    const currentDate = new Date()
    // user.passwordToken is hashed already, so token received from query string is also hashed in order to check if both are equal
    if(user.passwordToken === createHash(token) && user.passwordTokenExpirationDate > currentDate) {
      user.password = password
      user.passwordToken = null
      user.passwordTokenExpirationDate = null
      await user.save()
    }
  }
  res.status(StatusCodes.OK).json({msg: "Password is reset successfully"})
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword
};
