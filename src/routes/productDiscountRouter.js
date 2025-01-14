const express = require('express')
const productDiscountRouter = express.Router()
const upload = require('../middleware/handleFile')
const {
   getAllProductDiscountsHandler,
   getAllProductDiscountPanelsValidHandler,
   getAllProductDiscountsValidHandler,
   getAllProductDiscountsValidByProductIdHandler,
   createProductDiscountHandler,
} = require('../controllers/productDiscountController')

productDiscountRouter.get('/', getAllProductDiscountsHandler)
productDiscountRouter.get('/valid/all', getAllProductDiscountsValidHandler)
productDiscountRouter.get('/posters', getAllProductDiscountPanelsValidHandler)
productDiscountRouter.get('/valid/', getAllProductDiscountsValidByProductIdHandler)
productDiscountRouter.post('/create', upload.single('posterDiscount'), createProductDiscountHandler)

module.exports = productDiscountRouter
