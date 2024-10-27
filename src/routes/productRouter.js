const express = require('express')
const productRouter = express.Router()
const {
   getAllProductHandler,
   getAllProductByCategoryHandler,
   createProductHandler,
   editProduct,
   updateProductHandler,
   deleteProductHandler,
} = require('../controllers/productController')

productRouter.get('/', getAllProductHandler)
productRouter.get('/:categoryId', getAllProductByCategoryHandler)
productRouter.post('/create', createProductHandler)
productRouter.get('/edit/:productId', editProduct)
productRouter.put('/update/:productId', updateProductHandler)
productRouter.delete('/delete/:productId', deleteProductHandler)

module.exports = productRouter
