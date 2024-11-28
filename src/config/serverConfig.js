const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const {
   getAllPermissions,
   createPermissions,
   getAllRoles,
   createRoles,
   createRolePermission,
   getAllRolePermission,
} = require('../services/accessPermissionServices')
const { createEmployee } = require('../services/employeeServices')
const { createPosition } = require('../services/positionServices')
const { getAccountByUserName, createAdminAccount } = require('../services/authServices')
const { getAllCategories, createCategory } = require('../services/categoryServices')
const { getStoreInfo, createStoreInfo } = require('../services/storeInfoServices')

function serverConfigs(app) {
   app.use(express.static(path.join(__dirname, '../public')))
   app.use(cookieParser())
   app.use(
      cors({
         origin: 'http://localhost:3000',
         credentials: true,
      }),
   )
   app.use(express.json())
   app.use(express.urlencoded({ extended: true }))
}

async function checkCategories() {
   const categories = await getAllCategories()
   if (categories.length <= 0) {
      await createCategory()
   }
}

async function checkAccessPermissions() {
   const permissions = await getAllPermissions()
   const roles = await getAllRoles()
   if (permissions.length <= 0) {
      await createPermissions()
   }
   if (roles.length <= 0) {
      await createRoles()
   }
   const rolePermission = await getAllRolePermission()
   if (rolePermission.length <= 0) {
      createRolePermission()
   }
}

async function checkAdminAccount() {
   const adminAccount = await getAccountByUserName('admin')
   if (!adminAccount) {
      const accountId = await createAdminAccount()
      const positionId = await createPosition({ name: 'Quản lý' })
      const adminInfo = {
         accountId,
         positionId,
         name: 'ADMIN',
         birdth: null,
         address: null,
         phoneNumber: '0000000000',
         email: 'admin@gmail.com',
      }
      await createEmployee(adminInfo)
      const permissions = await getAllPermissions()
   }
}

async function checkStoreInfo() {
   const storeInfo = await getStoreInfo()
   if (!storeInfo) {
      await createStoreInfo()
   }
}

module.exports = {
   serverConfigs,
   checkCategories,
   checkAccessPermissions,
   checkAdminAccount,
   checkStoreInfo,
}
