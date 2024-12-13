const express = require('express')
const { getAllUserAndRolesHandler, updateUserRoleHandler } = require('../controllers/accessPermissionController')
const accessPermissionRouter = express.Router()

accessPermissionRouter.get('/', getAllUserAndRolesHandler)
accessPermissionRouter.post('/update/:accountId', updateUserRoleHandler)
// accessPermissionRouter.get('/edit/:employeeId', editEmployeeHandler)
// accessPermissionRouter.put('/update/:employeeId', upload.single('image'), updateEmployeeHandler)
// accessPermissionRouter.delete('/delete/:employeeId', deleteEmployeeHandler)

module.exports = accessPermissionRouter
