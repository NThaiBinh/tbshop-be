const express = require('express')
const employeesRouter = express.Router()
const { getAllEmployeeHandler, createEmployeeHandler } = require('../controllers/employeeController')

employeesRouter.get('/', getAllEmployeeHandler)
employeesRouter.get('/create', createEmployeeHandler)

module.exports = employeesRouter