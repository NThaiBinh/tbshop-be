const {
   getAllProductDiscounts,
   createProductDiscount,
   getAllProductDiscountPanelsValid,
   getAllProductDiscountsValid,
   getAllProductDiscountsValidByProductId,
} = require('../services/productDiscountServices')

async function getAllProductDiscountsHandler(req, res) {
   const page = req.query.page
   const productDiscounts = await getAllProductDiscounts(page)
   try {
      return res.status(200).json({
         code: 'SS',
         data: productDiscounts,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function getAllProductDiscountsValidHandler(req, res) {
   try {
      const productId = req.query.productId
      const productDiscounts = await getAllProductDiscountsValid()
      return res.status(200).json({
         code: 'SS',
         data: productDiscounts,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function getAllProductDiscountsValidByProductIdHandler(req, res) {
   try {
      const productId = req.query.productId
      const productDiscounts = await getAllProductDiscountsValidByProductId(productId)
      return res.status(200).json({
         code: 'SS',
         data: productDiscounts,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function getAllProductDiscountPanelsValidHandler(req, res) {
   try {
      const productDiscounts = await getAllProductDiscountPanelsValid()
      return res.status(200).json({
         code: 'SS',
         data: productDiscounts,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function createProductDiscountHandler(req, res) {
   const { productId, name, price, startDate, endDate } = req.body
   if (!productId || !name || !price || !startDate || !endDate || !req.file) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      await createProductDiscount(req.file, req.body)
      return res.status(200).json({
         code: 'SS',
         mesage: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

module.exports = {
   getAllProductDiscountsHandler,
   getAllProductDiscountPanelsValidHandler,
   getAllProductDiscountsValidHandler,
   getAllProductDiscountsValidByProductIdHandler,
   createProductDiscountHandler,
}
