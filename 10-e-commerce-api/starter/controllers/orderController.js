const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const Order = require('../models/Order')
const Product = require('../models/Product')
const {checkPermissions} = require('../utils')

const fakeStripeAPI = async ({amount, currency}) => {
    const client_secret = "someRandomValue"
    return {client_secret, amount}
}

// AFTER PROCEED TO CHECK OUT IS CLICKED, THREE THINGS WILL BE DONE
// GET SUB TOTAL BY CALLING PRODUCT 
// CALL STRIPE TO GET CLIENT_SECRET
// CREATE AN ORDER
const createOrder = async (req, res) => {
    const {items: cartItems, tax, shippingFee} = req.body;
    if(!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No cart items provided')
    }
    if(!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please provide tax and shipping fee')
    }
    let orderItems = []
    let subTotal = 0;

    for(const item of cartItems) {
        const dbProduct = await Product.findOne({_id: item.product})
        if(!dbProduct) {
            throw new CustomError.NotFoundError(`No product with id ${item.product}`)
        }
        const {name, price, image, _id} = dbProduct
        const singleOrderItem = {
            amount: item.amount,
            name, 
            price, 
            image,
            product: _id
        }
        // ADD item to order list
        orderItems = [...orderItems, singleOrderItem]
        // calculate sub total
        subTotal += item.amount * price
        console.log(orderItems);
        console.log(subTotal);
    }
    // calculate total
    const total = subTotal + shippingFee + tax
    // get client secret from stripe
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'hkd'
    })

    const order = await Order.create({
        orderItems,
        total,
        subtotal: subTotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId
    })

    res.status(StatusCodes.CREATED).json({order,
    clientSecret: order.clientSecret
    })
}

const getSingleOrder = async (req, res) => {
    const {id:orderId} = req.params
    const order = await Order.findOne({_id: orderId})
    if(!order) {
        throw new CustomError.NotFoundError(`Order id: ${orderId} is not available`)
    }
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({order})
}

const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({user: req.user.userId})
    res.status(StatusCodes.OK).json({orders, count: orders.length})
}

const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders, count: orders.length})
}

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;
  
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermissions(req.user, order.user);
    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();
  
    res.status(StatusCodes.OK).json({ order });
  };

module.exports = {
    createOrder,
    getSingleOrder,
    getCurrentUserOrders,
    getAllOrders,
    updateOrder
}
