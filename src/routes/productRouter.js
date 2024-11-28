const express = require('express')
const upload = require('../middleware/handleFile')
const productRouter = express.Router()
const {
   getAllProductHandler,
   getAllProductByCategoryHandler,
   createProductHandler,
   createProductConfigurationHandler,
   editProductHandler,
   editProductWidthoutConfig,
   updateProductHandler,
   deleteProductHandler,
   getProductDetailsHandler,
   productFilterHandler,
} = require('../controllers/productController')

productRouter.get('/', getAllProductHandler)
productRouter.get('/filter', productFilterHandler)
productRouter.get('/edit', editProductHandler)
productRouter.get('/details', getProductDetailsHandler)
productRouter.get('/:categoryId', getAllProductByCategoryHandler)
productRouter.post('/create', upload.array('productImages'), createProductHandler)
productRouter.post('/create-product-configuration/:productId', createProductConfigurationHandler)
productRouter.get('/edit-widthout-config/:productId', editProductWidthoutConfig)
productRouter.put('/update', upload.array('productImages'), updateProductHandler)
productRouter.delete('/delete/:productId', deleteProductHandler)

module.exports = productRouter
