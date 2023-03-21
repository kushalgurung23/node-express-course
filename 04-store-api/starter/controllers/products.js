const Product = require('../models/product')

const getAllProductsStatic =  async (req, res) => {
   
    const products = await Product.find({
        price: {$lt: 30}
    }).sort('-name price').select('name price').limit(5).skip(1)
    res.status(200).json({count: products.length, products})
    // throw new Error('testing async error')
    // return res.status(200).json({msg: "Products testing route"});
}

const getAllProducts =  async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query
    const queryObject = {}
    // FILTER
    if(featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company) {
        queryObject.company = {$regex: company, $options: 'i'}
    } 
    if(name) {
        queryObject.name = {$regex: name, $options: 'i'}
    }
    // numericFilters=rating>3,price>30
    if(numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        // filters=rating-$gt-3,price-$gt-30
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
        console.log(filters);

        const options = ['price', 'rating']
        filters = filters.split(',').forEach(element => {
            // array destructuring
            // ex: [a,b] = [10,20]
            // console.log(a) // logs 10
            const [field, operator, value] = element.split('-')
            if(options.includes(field)) {
                // ex: price: {$lt: 30}
                queryObject[field] = {[operator]: Number([value])}
            }
        });
        // const numericList = numericFilters.split(',').join(' ')
        console.log(queryObject);
        
    }
    let result = Product.find(queryObject)
    // SORT
    if(sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else {
        result = result.sort('-createdAt')
    }
    // FIELDS
    if(fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    // PAGINATION
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page -1) * limit

    result = result.skip(skip).limit(limit)
    const products = await result
    return res.status(200).json({count: products.length, products});
}

module.exports = {getAllProductsStatic, getAllProducts}  