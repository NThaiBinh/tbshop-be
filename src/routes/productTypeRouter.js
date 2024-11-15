const express = require('express')
const productTypeRouter = express.Router()
const {
   getAllProductTypesHandler,
   createProductTypeHandler,
   editProductTypeHandler,
   updateProductTypeHandler,
   deleteProductTypeHandler,
} = require('../controllers/productTypeController')

productTypeRouter.get('/', getAllProductTypesHandler)
productTypeRouter.post('/create', createProductTypeHandler)
productTypeRouter.get('/edit/:productTypeId', editProductTypeHandler)
productTypeRouter.put('/update/:productTypeId', updateProductTypeHandler)
productTypeRouter.delete('/delete/:productTypeId', deleteProductTypeHandler)

module.exports = productTypeRouter
