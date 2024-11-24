const {
   getAllStorewideDiscounts,
   createStorewideDiscount,
   getAllStorewideDiscountsValid,
   getAllStorewideDiscountPanelsValid,
} = require('../services/storewideDiscountServices')

async function getAllStorewideDiscountRouter(req, res) {
   try {
      const page = req.query.page
      const storewideDiscounts = await getAllStorewideDiscounts(page)
      return res.status(200).json({
         code: 'SS',
         data: storewideDiscounts,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function getAllStorewideDiscountsValidHandler(req, res) {
   try {
      const storewideDiscounts = await getAllStorewideDiscountsValid()
      return res.status(200).json({
         code: 'SS',
         data: storewideDiscounts,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function getAllStorewideDiscountPanelsValidHandler(req, res) {
   try {
      const storewideDiscounts = await getAllStorewideDiscountPanelsValid()
      return res.status(200).json({
         code: 'SS',
         data: storewideDiscounts,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function createStorewideDiscountHandler(req, res) {
   const { name, price, startDate, endDate } = req.body
   if (!name || !price || !startDate || !endDate || !req.file) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      await createStorewideDiscount(req.file, req.body)
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
   getAllStorewideDiscountRouter,
   getAllStorewideDiscountsValidHandler,
   getAllStorewideDiscountPanelsValidHandler,
   createStorewideDiscountHandler,
}
