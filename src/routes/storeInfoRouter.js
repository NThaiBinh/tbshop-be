const express = require('express')
const storeInfoRouter = express.Router()
const { getStoreInfoHandler, updateStoreInfoHandler } = require('../controllers/storeInfoController')


storeInfoRouter.get('/', getStoreInfoHandler)
storeInfoRouter.put('/update', updateStoreInfoHandler)

module.exports = storeInfoRouter