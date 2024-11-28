const express = require('express')
const { searchProductsHandler } = require('../controllers/searchController')
const searchRouter = express.Router()

searchRouter.get('/products', searchProductsHandler)
// searchRouter.post('/create', createProductTypeHandler)
// searchRouter.get('/edit/:productTypeId', editProductTypeHandler)
// searchRouter.put('/update/:productTypeId', updateProductTypeHandler)
// searchRouter.delete('/delete/:productTypeId', deleteProductTypeHandler)

module.exports = searchRouter
