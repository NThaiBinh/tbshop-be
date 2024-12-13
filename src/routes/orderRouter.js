const express = require('express')
const {
   getAllOrderHandler,
   createOrderHandler,
   cancelOrderHandler,
   confirmOrderHandler,
   getSearchResultsHandler,
} = require('../controllers/orderController')
const orderRouter = express.Router()

orderRouter.get('/', getAllOrderHandler)
orderRouter.post('/create', createOrderHandler)
orderRouter.post('/cancel-order', cancelOrderHandler)
orderRouter.post('/confirm-order', confirmOrderHandler)
orderRouter.get('/search', getSearchResultsHandler)

module.exports = orderRouter
