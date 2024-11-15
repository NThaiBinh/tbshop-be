const {
   getAllCategories,
   createCategory,
   getCategoryById,
   updateCategory,
   deleteCategory,
} = require('../models/categories')

//-----GET ALL-----
async function getAllCategoryHandler(req, res) {
   try {
      const categories = await getAllCategories()
      return res.status(200).json({
         code: 'SS',
         data: categories,
      })
   } catch (err) {
      return res.status(502).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

//-----CREATE-----
async function createCategoryHandler(req, res) {
   const { name } = req.body
   if (!name) {
      return res.status(400).json({
         code: 'ER',
         mesage: 'Missing data',
      })
   }

   try {
      await createCategory(req.body)
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

async function editCategory(req, res) {
   const categoryId = req.params.categoryId
   if (!categoryId) {
      return res.status(400).json({
         code: 'SS',
         message: 'Missing data',
      })
   }

   try {
      const category = await getCategoryById(categoryId)
      if (!category) {
         return res.status(200).json({
            code: 'NF',
            message: 'Category not found',
         })
      }
      return res.status(200).json({
         code: 'SS',
         data: category,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'SS',
         message: 'Server error',
         err,
      })
   }
}

//-----UPDATE-----
async function updateCategoryHandler(req, res) {
   const categoryId = req.params.categoryId
   const { name } = req.body
   if (!categoryId || !name) {
      return res.status(400).json({
         code: 'ER',
         mesage: 'Missing data',
      })
   }

   try {
      await updateCategory({ categoryId, ...req.body })
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

async function deleteCategoryHandler(req, res) {
   const categoryId = req.params.categoryId
   if (!categoryId) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      await deleteCategory(categoryId)
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
   getAllCategoryHandler,
   createCategoryHandler,
   editCategory,
   updateCategoryHandler,
   deleteCategoryHandler,
}
