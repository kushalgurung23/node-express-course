const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes');
const {uploadProductImageLocal} = require('./uploadsController')
const CustomError = require('../errors')

const createProduct = async(req, res) => {
    // RETURNS THE FILE NAME INCLUDING /uploads/ folder 
    const imageName = await uploadProductImageLocal(req, res);
    if(!imageName) {
        throw CustomError.BadRequestError('Error occured while uploading image') ;
    }
    const body = {
        ...req.body,
        "image": imageName
    }
    console.log(body);
    const product = await Product.create(body);
    res.status(StatusCodes.CREATED).json({product});  
}

const getAllProduct = async(req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({products})
}

module.exports = {
    createProduct, getAllProduct
}