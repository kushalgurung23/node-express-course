const express = require('express');
const app = express();
const {products, people} = require('./data.js');

app.get('/', (req, res) => {
   res.send('<h1>HOME PAGE</h1><a href="/api/products">products</a>')
});

app.get('/api/products', (req, res) => {
    const newProducts = products.map((product) => {
        const {id, name, image} = product;
        return {id, name, image};
    })
    res.json(newProducts);
})

// ROUTE PARAMETER
app.get('/api/products/:productId', (req, res) => {
    const {productId} = req.params;
    const singleProduct = products.find((product) => product.id === Number(productId));
    if(!singleProduct) {
        return res.status(404).send('Product does not exist.');
    }
    const {id, name} = singleProduct;
    res.json({id, name});
})

app.get('/api/products/:productId/reviews/:reviewId', (req, res) => {
    console.log(req.params);
    res.send('HELLO ROUTE PARAMETERS');
})

// QUERY PARAMETER
app.get('/api/v1/query', (req, res) => {
    const {search, limit} = req.query;
    // spread operator iterates over the array and adds them into a new array
    let sortedProducts = [...products];
    if(search) {
        sortedProducts = sortedProducts.filter((product) => {
            return product.name.startsWith(search);
        })
    }
    if(limit) {
        sortedProducts = sortedProducts.slice(0, Number(limit))
    }
    if(sortedProducts.length < 1) {
        res.status(200).json({success: true, data: []})
    }
    res.status(200).json({success: true, data: sortedProducts});
})

app.listen(3000, () => {
    console.log("3000 server has started");
});

// 6:07:36