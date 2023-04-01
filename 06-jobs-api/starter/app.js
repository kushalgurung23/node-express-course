require('dotenv').config();
require('express-async-errors');

// EXTRA SECURITY PACKAGES
// helmet: sets numerous http headers to prevent numerous api attacks
const helmet = require('helmet')
// cors: ensures api is accessible from different domain
const cors = require('cors')

// xss-clean: sanitizes the user input in req.body, req.query and req.params and prevents from cross-site scripting attacks
const xss = require('xss-clean')

// express-rate-limit: limits the number of request the user can make
const rateLimiter = require('express-rate-limit')

const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect')

// JWT authentication
const authenticateUser = require('./middleware/authentication')

// routes
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

// if we are using reverse proxy (Heroku, Bluemix, AWS ELB, Nginx)
app.set('trust proxy', 1)

// extra packages
app.use(rateLimiter({
  windowMS: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMS
}))

app.use(helmet)
app.use(cors)
app.use(xss)


// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

// COMPLETE
