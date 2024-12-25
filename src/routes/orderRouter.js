const express = require('express')
const {
   getAllOrderHandler,
   createOrderHandler,
   cancelOrderHandler,
   confirmOrderHandler,
} = require('../controllers/orderController')
const orderRouter = express.Router()

orderRouter.get('/', getAllOrderHandler)
orderRouter.post('/create', createOrderHandler)
orderRouter.post('/cancel-order', cancelOrderHandler)
orderRouter.post('/confirm-order', confirmOrderHandler)

module.exports = orderRouter
