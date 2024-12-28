const express = require('express')
const { searchProductsHandler } = require('../controllers/searchController')
const searchRouter = express.Router()

searchRouter.get('/products', searchProductsHandler)

module.exports = searchRouter
