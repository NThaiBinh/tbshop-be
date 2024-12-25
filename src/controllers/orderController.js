const { createOrder, getAllOrders, cancelOrder } = require('../services/orderServices')

async function getAllOrderHandler(req, res) {
   const orders = await getAllOrders()
   try {
      return res.status(200).json({
         code: 'SS',
         data: orders,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function createOrderHandler(req, res) {
   await createOrder(req.body)
   try {
      return res.status(200).json({
         code: 'SS',
         mesage: 'Update successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function cancelOrderHandler(req, res) {
   await cancelOrder(req.body)
   try {
      return res.status(200).json({
         code: 'SS',
         mesage: 'Cancel successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function confirmOrderHandler(req, res) {
   try {
      await cancelOrder(req.body)
      return res.status(200).json({
         code: 'SS',
         mesage: 'Cancel successfully',
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
   getAllOrderHandler,
   createOrderHandler,
   cancelOrderHandler,
   confirmOrderHandler,
}
