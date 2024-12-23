const express = require('express')
const cartRouter = express.Router()
const {
   getCartHandler,
   getCartItemsHandler,
   addCartItemHandler,
   updateCartItemHandler,
   deleteCartItemHandler,
} = require('../controllers/cartController')

cartRouter.get('/:customerId', getCartHandler)
cartRouter.get('/cart-items/:cartId', getCartItemsHandler)
cartRouter.post('/add-cart-item', addCartItemHandler)
cartRouter.put('/update', updateCartItemHandler)
cartRouter.delete('/delete', deleteCartItemHandler)

module.exports = cartRouter
