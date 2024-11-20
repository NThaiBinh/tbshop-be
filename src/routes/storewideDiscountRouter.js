const express = require('express')
const storewideDiscountRouter = express.Router()
const upload = require('../middleware/handleFile')
const {
   getAllStorewideDiscountRouter,
   getAllStorewideDiscountsValidHandler,
   getAllStorewideDiscountPanelsValidHandler,
   createStorewideDiscountHandler,
} = require('../controllers/storewideDiscountController')
storewideDiscountRouter.get('/', getAllStorewideDiscountRouter)
storewideDiscountRouter.get('/valid', getAllStorewideDiscountsValidHandler)
storewideDiscountRouter.get('/panels', getAllStorewideDiscountPanelsValidHandler)
storewideDiscountRouter.post('/create', upload.single('posterDiscount'), createStorewideDiscountHandler)

module.exports = storewideDiscountRouter
