const express = require('express')
const { getAllUserAndRolesHandler, updateUserRoleHandler } = require('../controllers/accessPermissionController')
const accessPermissionRouter = express.Router()

accessPermissionRouter.get('/', getAllUserAndRolesHandler)
accessPermissionRouter.post('/update/:accountId', updateUserRoleHandler)

module.exports = accessPermissionRouter
