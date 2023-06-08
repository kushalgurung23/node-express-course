const jwt = require('jsonwebtoken');

// const createJWT = ({ payload }) => {
//   const token = jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_LIFETIME,
//   });
//   return token;
// };
 
// const attachSingleCookieToResponse = ({ res, user }) => {
//   const token = createJWT({ payload: user });

//   const oneDay = 1000 * 60 * 60 * 24;

//   res.cookie('token', token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_ENV === 'production',
//     signed: true,
//   });
// };

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const attachMultipleCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: {user} });
  const refreshTokenJWT = createJWT({payload: {user, refreshToken}})

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    maxAge: oneDay,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay * 60),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

};

module.exports = {
  createJWT,
  isTokenValid,
  attachMultipleCookiesToResponse,
};
