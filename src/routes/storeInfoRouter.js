const express = require('express')
const storeInfoRouter = express.Router()
const { getStoreInfoHandler, updateStoreInfoHandler } = require('../controllers/storeInfoController')
const upload = require('../middleware/handleFile')

storeInfoRouter.get('/', getStoreInfoHandler)
storeInfoRouter.put('/update', upload.single('image'), updateStoreInfoHandler)

module.exports = storeInfoRouter
