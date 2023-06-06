const stripe = require('stripe')(process.env.STRIPE_KEY);

const stripeController = async (req, res) => {
    const {purchase, total_amount, shipping_fee} = req.body;

    // COMMUNICATE WITH DB TO GET ACTUAL PRICES OF THE PRODUCTS
    const calculateOrderAmount = () => {
        return total_amount+shipping_fee;
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(),
        currency: 'hkd'
    })
    console.log(paymentIntent);
    res.json({
        clientSecret: paymentIntent.client_secret
    })
}

module.exports = stripeController