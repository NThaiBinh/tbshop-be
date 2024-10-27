const {
   getAllProducts,
   getAllProductByCategory,
   createProduct,
   getProductById,
   updateProduct,
   deleteProduct,
} = require('../models/products')

//-----GET ALL-----
async function getAllProductHandler(req, res) {
   try {
      const page = req.query.page
      const products = await getAllProducts(page)
      return res.status(200).json(products)
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function getAllProductByCategoryHandler(req, res) {
   const categoryId = req.params.categoryId
   console.log(categoryId)
   if (categoryId) {
      const products = await getAllProductByCategory(categoryId)
      try {
         return res.status(200).json(products)
      } catch (err) {
         return res.status(500).json({
            message: 'Server error',
            err,
         })
      }
   } else {
      return res.status(500).json({
         message: 'Missing data',
      })
   }
}

//-----CREATE-----
async function createProductHandler(req, res) {
   const { categoryId, manufacId, name, description, quantity } = req.body
   if (!categoryId || !manufacId || !name || !description || !quantity) {
      return res.status(400).json({
         mesage: 'Missing data',
      })
   }

   try {
      await createProduct(req.body)
      return res.status(200).json({
         mesage: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function editProduct(req, res) {
   const productId = req.params.productId
   if (!productId) {
      return res.status(400).json({
         message: 'Missing data',
      })
   }

   try {
      const product = await getProductById(productId)
      if (!product) {
         return res.status(200).json({
            message: 'Product not found',
         })
      }
      return res.status(200).json(product)
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

//-----UPDATE-----
async function updateProductHandler(req, res) {
   const productId = req.params.productId
   const { categoryId, manufacId, name, description, quantity } = req.body
   if (!productId || !categoryId || !manufacId || !name || !description || !quantity) {
      return res.status(400).json({
         mesage: 'Missing data',
      })
   }

   try {
      await updateProduct({ productId, ...req.body })
      return res.status(200).json({
         message: 'Update successfully',
      })
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function deleteProductHandler(req, res) {
   const productId = req.params.productId
   if (!productId) {
      return res.status(400).json({
         message: 'Missing data',
      })
   }

   try {
      await deleteProduct(productId)
      return res.status(200).json({
         mesage: 'Delete successfully',
      })
   } catch (err) {
      return res.status(502).json({
         message: 'Server error',
         err,
      })
   }
}

module.exports = {
   getAllProductHandler,
   getAllProductByCategoryHandler,
   createProductHandler,
   editProduct,
   updateProductHandler,
   deleteProductHandler,
}
