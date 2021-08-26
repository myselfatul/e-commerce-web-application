'use strict';
require("dotenv").config()
const auth = require("./middleware/auth")
const express = require('express')
const path = require('path')

const customerController = require('./controllers/customerController')
const adminController = require('./controllers/adminController')

const app = express()

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

app.use('/images', express.static(path.join(__dirname, '/images')));


// verify client
app.use('/v', auth.verifyClient)

// admin routes
app.post('/v/admin/register', adminController.register)

app.post('/v/admin/login', adminController.login)

app.delete('/v/admin/logout', auth.verifyToken, adminController.logout)

app.post('/v/admin/addproduct', auth.verifyToken, adminController.addProduct)

app.get('/v/admin/orders', auth.verifyToken, adminController.orders)


// customer routes
app.post('/v/customer/register', customerController.register)

app.post('/v/customer/login', customerController.login)

app.delete('/v/customer/logout', auth.verifyToken, customerController.logout)

app.get('/v/customer/getallproducts', auth.verifyToken, customerController.browseAllProducts)

app.get('/v/customer/getproduct/:id', auth.verifyToken, customerController.browseProduct)

app.post('/v/customer/placeorder', auth.verifyToken, customerController.placeOrder)

app.get('/v/customer/orders', auth.verifyToken, customerController.orders)


// server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
