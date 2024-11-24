const {
   getCart,
   addCartItem,
   getCartByCustomerId,
   getCartItems,
   updateCartItem,
   deleteCartItem,
} = require('../services/cartServices')

async function getCartHandler(req, res) {
   const customerId = req.params.customerId
   try {
      const cartInfo = await getCartByCustomerId(customerId)
      return res.status(200).json({
         code: 'SS',
         data: cartInfo,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function getCartItemHandler(req, res) {
   const cartId = req.params.cartId
   try {
      const cartItems = await getCartItems(cartId)
      return res.status(200).json({
         code: 'SS',
         data: cartItems,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function addCartItemHandler(req, res) {
   const {
      cartId,
      productId,
      productConfigurationId,
      productColorId,
      quantity,
      price,
      totalPrice,
      productDiscountIds,
   } = req.body
   console.log(req.body)
   if (!cartId || !productId || !productConfigurationId || !productColorId || !quantity || !price || !totalPrice) {
      return res.status(400).json({
         code: 'ER',
         mesage: 'Missing data',
      })
   }

   try {
      await addCartItem(req.body)
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
async function updateCartItemHandler(req, res) {
   const {
      cartId,
      productId,
      productConfigurationId,
      productColorId,
      quantity,
      price,
      totalPrice,
      productDiscountIds,
   } = req.body
   if (!cartId || !productId || !productConfigurationId || !productColorId || !price || !totalPrice) {
      return res.status(400).json({
         code: 'ER',
         mesage: 'Missing data',
      })
   }
   if (!quantity) {
      req.body.quantity = 1
   }
   try {
      await updateCartItem({ ...req.body, cartId })
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
async function deleteCartItemHandler(req, res) {
   const { cartId, productId, productConfigurationId, productColorId } = req.body
   if (!cartId || !productId || !productConfigurationId || !productColorId) {
      return res.status(400).json({
         code: 'ER',
         mesage: 'Missing data',
      })
   }

   try {
      await deleteCartItem(req.body)
      return res.status(200).json({
         code: 'SS',
         mesage: 'Delete successfully',
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
   getCartHandler,
   getCartItemHandler,
   addCartItemHandler,
   updateCartItemHandler,
   deleteCartItemHandler,
}
