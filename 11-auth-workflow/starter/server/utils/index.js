const { createJWT, isTokenValid, attachMultipleCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkPermissions');
const sendVerificationEmail = require('./sendVerificationEmail')
const sendResetPasswordEmail = require('./sendResetPasswordEmail')
const createHash = require('./createHash')

module.exports = {
  createJWT,
  isTokenValid,
  attachMultipleCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash
};
