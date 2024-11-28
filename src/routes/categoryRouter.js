const express = require('express')
const categoryRouter = express.Router()
const {
   getAllCategoryHandler,
   editCategory,
   updateCategoryHandler,
   deleteCategoryHandler,
} = require('../controllers/categoryController')

categoryRouter.get('/', getAllCategoryHandler)
categoryRouter.get('/edit/:categoryId', editCategory)
categoryRouter.put('/update/:categoryId', updateCategoryHandler)
categoryRouter.delete('/delete/:categoryId', deleteCategoryHandler)

module.exports = categoryRouter
