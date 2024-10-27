const express = require('express')
const manufacturerRouter = express.Router()
const { getAllManufacHandler, createManufacHandler, editManufacHandler, updateManufacHandler, deleteManufacHandler } = require('../controllers/manufacturerController')

manufacturerRouter.get('/', getAllManufacHandler)
manufacturerRouter.post('/create', createManufacHandler)
manufacturerRouter.get('/edit/:manufacId', editManufacHandler)
manufacturerRouter.put('/update/:manufacId', updateManufacHandler)
manufacturerRouter.delete('/delete/:manufacId', deleteManufacHandler)

module.exports = manufacturerRouter