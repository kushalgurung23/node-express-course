class CustomError extends Error {
    constructor(message, statusCode) {
        // calls constructor of parent class
        // as a result, we get access to all properties and methods of parent class
        super(message)
        this.statusCode = statusCode;
    }
}

const createCustomError = (msg, statusCode) => {
    return new CustomError(msg, statusCode)
}

module.exports = {createCustomError, CustomError};