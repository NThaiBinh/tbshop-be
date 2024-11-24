const express = require('express')
const employeesRouter = express.Router()
const {
   getAllEmployeeHandler,
   createEmployeeHandler,
   editEmployeeHandler,
} = require('../controllers/employeeController')

employeesRouter.get('/', getAllEmployeeHandler)
employeesRouter.get('/create', createEmployeeHandler)
employeesRouter.get('/edit/:employeeId', editEmployeeHandler)
// employeesRouter.put('/update/:manufacId', upload.single('image'), updateManufacHandler)
// employeesRouter.delete('/delete/:manufacId', deleteManufacHandler)

module.exports = employeesRouter
