const express = require('express')
const upload = require('../middleware/handleFile')
const productRouter = express.Router()
const {
   getAllProductHandler,
   getAllProductByCategoryHandler,
   createProductHandler,
   createProductConfigurationHandler,
   editProduct,
   editProductWidthoutConfig,
   updateProductHandler,
   deleteProductHandler,
} = require('../controllers/productController')

productRouter.get('/', getAllProductHandler)
productRouter.get('/edit', editProduct)
productRouter.get('/:categoryId', getAllProductByCategoryHandler)
productRouter.post('/create', upload.array('productImages'), createProductHandler)
productRouter.post('/create-product-configuration/:productId', createProductConfigurationHandler)
productRouter.get('/edit-widthout-config/:productId', editProductWidthoutConfig)
productRouter.put('/update', upload.array('productImages'), updateProductHandler)
productRouter.delete('/delete/:productId', deleteProductHandler)

module.exports = productRouter
