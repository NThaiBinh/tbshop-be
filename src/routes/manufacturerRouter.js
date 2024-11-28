const express = require('express')
const upload = require('../middleware/handleFile')

const manufacturerRouter = express.Router()
const {
   getAllManufacsHandler,
   createManufacHandler,
   editManufacHandler,
   updateManufacHandler,
   deleteManufacHandler,
   getAllManufacsByCategoryIdHandler,
} = require('../controllers/manufacturerController')

manufacturerRouter.get('/:categoryId', getAllManufacsByCategoryIdHandler)
manufacturerRouter.get('/', getAllManufacsHandler)
manufacturerRouter.post('/create', upload.single('image'), createManufacHandler)
manufacturerRouter.get('/edit/:manufacId', editManufacHandler)
manufacturerRouter.put('/update/:manufacId', upload.single('image'), updateManufacHandler)
manufacturerRouter.delete('/delete/:manufacId', deleteManufacHandler)

module.exports = manufacturerRouter
