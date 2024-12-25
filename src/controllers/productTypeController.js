const {
   getAllProductTypes,
   getProductTypeById,
   createProductType,
   updateProductType,
   deleteProductType,
} = require('../services/productTypeServices')

async function getAllProductTypesHandler(req, res) {
   try {
      const productType = await getAllProductTypes()
      return res.status(200).json({
         code: 'SS',
         data: productType,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function createProductTypeHandler(req, res) {
   const { name } = req.body
   if (!name) {
      return res.status(400).json({
         code: 'ER',
         mesage: 'Missing data',
      })
   }
   try {
      await createProductType(req.body)
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

async function editProductTypeHandler(req, res) {
   const productTypeId = req.params.productTypeId
   if (!productTypeId) {
      return res.status(400).json({
         code: 'ER',
         meaagse: 'Missing data',
      })
   }

   try {
      const productType = await getProductTypeById(productTypeId)
      if (!productType) {
         return res.status(200).json({
            code: 'NF',
            meaasge: 'Product type not found',
         })
      }
      return res.status(200).json({
         code: 'SS',
         data: productType,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function updateProductTypeHandler(req, res) {
   const productTypeId = req.params.productTypeId
   const { name } = req.body
   if (!productTypeId || !name) {
      return res.status(400).json({
         code: 'ER',
         mesage: 'Missing data',
      })
   }

   try {
      await updateProductType({ productTypeId, ...req.body })
      return res.status(200).json({
         code: 'SS',
         message: 'Update successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function deleteProductTypeHandler(req, res) {
   const productTypeId = req.params.productTypeId
   if (!productTypeId) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      await deleteProductType(productTypeId)
      return res.status(200).json({
         code: 'SS',
         mesage: 'Delete successfully',
      })
   } catch (err) {
      return res.status(502).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

module.exports = {
   getAllProductTypesHandler,
   createProductTypeHandler,
   editProductTypeHandler,
   updateProductTypeHandler,
   deleteProductTypeHandler,
}
