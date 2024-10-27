const express = require('express')
const categoryRouter = express.Router()
const { getAllCategoryHandler, createCategoryHandler, editCategory, updateCategoryHandler, deleteCategoryHandler } = require('../controllers/categoryController')

categoryRouter.get('/', getAllCategoryHandler)
categoryRouter.post('/create', createCategoryHandler)
categoryRouter.get('/edit/:categoryId', editCategory)
categoryRouter.put('/update/:categoryId', updateCategoryHandler)
categoryRouter.delete('/delete/:categoryId', deleteCategoryHandler)

module.exports = categoryRouter