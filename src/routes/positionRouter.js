const express = require('express')
const positionRouter = express.Router()
const { getAllPositionHandler, createPositionHandler, editPositionHandler, updatePositionHandler, deletePositionHandler } = require('../controllers/positionController')


positionRouter.get('/', getAllPositionHandler)
positionRouter.post('/create', createPositionHandler)
positionRouter.get('/edit/:positionId', editPositionHandler)
positionRouter.put('/update/:positionId', updatePositionHandler)
positionRouter.delete('/delete/:positionId', deletePositionHandler)

module.exports = positionRouter