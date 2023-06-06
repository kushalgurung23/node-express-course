const {StatusCodes} = require('http-status-codes');
const path = require('path')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const uuid = require('uuid')

// FOR LOCAL REFEREBCE
const uploadProductImageLocal = async(req, res) => {
    
     // check if file exists
    if(!req.files) {
        throw new CustomError.BadRequestError('No file uploaded')
    }
    // check format
    const productImage = req.files.image;   
    if(!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please upload image');
    }
    // check size
    const maxSize = 40000000
    if(productImage.size > maxSize) {
        throw new CustomError.BadRequestError('Please upload image smaller than 40 MB')
    }
    // GENERATING UNIQUE ID FOR IMAGE
    const uniquePhotoId = uuid.v4();

    // IMAGE EXTENSION IS ADDED AT THE END. [.pop() will return the last item of array after splitted through delimiter "/"].
    const uniqueImageName = `${uniquePhotoId}.${productImage.mimetype.split("/").pop()}`;
    console.log(uniqueImageName);
    const imagePath = path.join(__dirname, '../public/uploads/'+`${uniqueImageName}`);
   
    await productImage.mv(imagePath);
    // return res.status(StatusCodes.OK).send({image: {src: `}`}});
    return `/uploads/${uniqueImageName}`;
}

// FOR UPLOADING IN CLOUDINARY
const uploadProductImage = async(req, res) => {
    if(!req.files) {
        throw new CustomError.BadRequestError('No file uploaded')
    }
    const productImage = req.files.image;   
    if(!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please upload image');
    }
    // 40MB
    const maxSize = 40000000
    if(productImage.size > maxSize) {
        throw new CustomError.BadRequestError('Please upload image smaller than 40 MB')
    }
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true,
        folder: 'file_upload'
    })
    fs.unlinkSync(req.files.image.tempFilePath)
    return res.status(StatusCodes.OK).json({image: {src: result.secure_url}}) };

module.exports = {
    uploadProductImageLocal,
   uploadProductImage
}