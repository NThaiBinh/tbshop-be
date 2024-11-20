const { createProductConfiguration } = require('../services/productConfigurationServices')
const {
   getAllProducts,
   getAllProductByCategory,
   getAllInfoProducts,
   createProduct,
   getProductInfoWidthoutConfig,
   getProductById,
   updateProduct,
   deleteProduct,
   getProductDetails,
} = require('../services/productServices')
const { setNullFieldEmty } = require('../utils/lib')

async function getAllProductHandler(req, res) {
   try {
      const page = req.query.page
      const products = await getAllInfoProducts(page)
      return res.status(200).json({
         code: 'SS',
         data: products,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function getAllProductByCategoryHandler(req, res) {
   const categoryId = req.params.categoryId
   if (!categoryId) {
      return res.status(500).json({
         code: 'ER',
         message: 'Missing data',
      })
   }
   try {
      const products = await getAllProductByCategory(categoryId)
      return res.status(200).json({
         code: 'SS',
         data: products,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function createProductHandler(req, res) {
   const productImages = req.files
   const productInfo = setNullFieldEmty(JSON.parse(req.body.productInfo))
   const productConfiguration = setNullFieldEmty(JSON.parse(req.body.productConfiguration))
   const { categoryId, manufacId, productTypeId, name, quantity, price } = productInfo
   const {} = productConfiguration
   const productColors = req.body.productColors

   if (!categoryId || !manufacId || !productTypeId || !name || !quantity || !price || !productImages) {
      return res.status(400).json({
         code: 'ER',
         mesage: 'Missing data',
      })
   }

   try {
      await createProduct({ productImages, productInfo, productConfiguration, productColors })
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

async function createProductConfigurationHandler(req, res) {
   const productId = req.params.productId
   const productConfiguration = setNullFieldEmty(req.body.productConfiguration)
   if (productId) {
      try {
         await createProductConfiguration(productConfiguration, productId)
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
}

async function editProduct(req, res) {
   const productId = req.query.productId
   const productConfigurationId = req.query.productConfigurationId
   if (!productId || !productConfigurationId) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   const productDetails = await getProductDetails(productId, productConfigurationId)
   try {
      if (!productDetails) {
         return res.status(200).json({
            code: 'NF',
            message: 'Product not found',
         })
      }
      return res.status(200).json({
         code: 'SS',
         data: productDetails,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function editProductWidthoutConfig(req, res) {
   const productId = req.params.productId
   if (!productId) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   const productInfo = await getProductInfoWidthoutConfig(productId)
   try {
      if (!productInfo) {
         return res.status(200).json({
            code: 'NF',
            message: 'Product not found',
         })
      }
      return res.status(200).json({
         code: 'SS',
         data: productInfo,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function updateProductHandler(req, res) {
   const productImages = req.files
   const productInfo = setNullFieldEmty(JSON.parse(req.body.productInfo))
   const productConfiguration = setNullFieldEmty(JSON.parse(req.body.productConfiguration))
   const { categoryId, manufacId, productTypeId, name, quantity, price } = productInfo
   const {} = productConfiguration
   const productColors = req.body.productColors
   const productId = req.query.productId
   const productConfigurationId = req.query.productConfigurationId

   if (
      !productId ||
      !productConfigurationId ||
      !categoryId ||
      !manufacId ||
      !productTypeId ||
      !name ||
      !quantity ||
      !price ||
      !productImages
   ) {
      return res.status(400).json({
         code: 'ER',
         mesage: 'Missing data',
      })
   }

   try {
      await updateProduct(
         productId,
         productImages,
         productInfo,
         productConfigurationId,
         productConfiguration,
         productColors,
      )
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

async function deleteProductHandler(req, res) {
   const productId = req.params.productId
   if (!productId) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      await deleteProduct(productId)
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
   getAllProductHandler,
   getAllProductByCategoryHandler,
   createProductHandler,
   createProductConfigurationHandler,
   editProduct,
   editProductWidthoutConfig,
   updateProductHandler,
   deleteProductHandler,
}
