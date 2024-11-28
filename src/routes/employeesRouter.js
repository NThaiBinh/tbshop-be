const express = require('express')
const employeesRouter = express.Router()
const upload = require('../middleware/handleFile')
const {
   getAllEmployeeHandler,
   createEmployeeHandler,
   editEmployeeHandler,
   updateEmployeeHandler,
   deleteEmployeeHandler,
} = require('../controllers/employeeController')

employeesRouter.get('/', getAllEmployeeHandler)
employeesRouter.post('/create', upload.single('image'), createEmployeeHandler)
employeesRouter.get('/edit/:employeeId', editEmployeeHandler)
employeesRouter.put('/update/:employeeId', upload.single('image'), updateEmployeeHandler)
employeesRouter.delete('/delete/:employeeId', deleteEmployeeHandler)

module.exports = employeesRouter
