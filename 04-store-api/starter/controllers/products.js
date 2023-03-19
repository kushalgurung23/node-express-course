const Product = require('../models/product')

const getAllProductsStatic =  async (req, res) => {
   
    const products = await Product.find({}).sort('-name price').select('name price').limit(5).skip(1)
    res.status(200).json({count: products.length, products})
    // throw new Error('testing async error')
    // return res.status(200).json({msg: "Products testing route"});
}

const getAllProducts =  async (req, res) => {
    const {featured, company, name, sort, fields, } = req.query
    const queryObject = {}
    if(featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company) {
        queryObject.company = {$regex: company, $options: 'i'}
    } 
    if(name) {
        queryObject.name = {$regex: name, $options: 'i'}
    }
    let result = Product.find(queryObject)
    if(sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else {
        result = result.sort('-createdAt')
    }
    if(fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page -1) * limit

    result = result.skip(skip).limit(limit)
    const products = await result
    return res.status(200).json({count: products.length, products});
}

module.exports = {getAllProductsStatic, getAllProducts}  