require('dotenv').config()
const connectionPool = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')
const sql = require('mssql')
const { getRoleByAccountId } = require('./accessPermissionServices')

const columns = [
   'MAKH',
   'MATK',
   'TENKH',
   'ANHKH',
   'NGAYSINHKH',
   'DIACHIKH',
   'SDTKH',
   'EMAILKH',
   'NGAYTAO',
   'NGAYCAPNHAT',
]

async function createCustomer(customerInfo) {
   const { accountId, name, image, birth, address, phoneNumber, email } = customerInfo
   const customerId = CreateKey('KH_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('customerId', sql.TYPES.VarChar, customerId)
         .input('accountId', sql.TYPES.VarChar, accountId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('image', sql.TYPES.VarChar, image)
         .input('birth', sql.TYPES.VarChar, birth)
         .input('address', sql.TYPES.VarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO KHACHHANG (${columns}) VALUES(
                    @customerId,
                    @accountId,
                    @name,
                    @image,
                    @birth,
                    @address,
                    @phoneNumber,
                    @email,
                    @createdAt,
                    @updatedAt)`)
   })
   return customerId
}

async function getCustomerAndRolesByAccountId(accountId) {
   return await connectionPool
      .then((pool) => {
         return pool.request().input('accountId', sql.TYPES.VarChar, accountId)
            .query(`SELECT *, (SELECT MAVAITRO FROM CO_VAI_TRO WHERE CO_VAI_TRO.MATK = KHACHHANG.MATK FOR JSON PATH) as QUYEN
               FROM KHACHHANG WHERE KHACHHANG.MATK = @accountId`)
      })
      .then((customerInfo) => {
         const roles = customerInfo.recordset[0].QUYEN ? JSON.parse(customerInfo.recordset[0].QUYEN) : []
         return {
            ...customerInfo.recordset[0],
            QUYEN: roles.map((role) => role.MAVAITRO),
         }
      })
}

async function getCustomerById(customerId) {
   const customerInfo = await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('customerId', sql.TYPES.VarChar, customerId)
            .query(`SELECT * FROM KHACHHANG WHERE MaKH = @customerId`)
      })
      .then((customer) => customer.recordset[0])
   const customerRoles = await getRoleByAccountId(customerInfo.MATK)
   return {
      ...customerInfo,
      roles: customerRoles.map((customerRole) => customerRole.MAVAITRO),
   }
}

async function getCustomerByEmail(email) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('email', sql.TYPES.VarChar, email)
            .query(`SELECT * FROM KHACHHANG WHERE EMAILKH = @email`)
      })
      .then((customer) => customer.recordset[0])
}

async function getAllCustomers(page) {
   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      return await connectionPool
         .then((pool) => {
            return pool.request().query(`SELECT * FROM KHACHHANG
                    ORDER BY NgayTao
                    OFFSET ${skip} ROWS 
                    FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
         })
         .then((customers) => {
            return customers.recordset
         })
   }
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT * FROM KHACHHANG`)
      })
      .then((customers) => {
         return customers.recordset
      })
}

async function updateCustomer(data) {
   const { customerId, email, name, birdth, address, phoneNumber } = data
   const updatedAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('customerId', sql.TYPES.VarChar, customerId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('birdth', sql.TYPES.DateTimeOffset, birdth)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`UPDATE KHACHHANG SET
                ${columns[1]} = @name,
                ${columns[2]} = @birdth,
                ${columns[3]} = @address,
                ${columns[4]} = @phoneNumber,
                ${columns[5]} = @email,
                ${columns[6]} = @updatedAt
                WHERE ${columns[0]} = @customerId`)
   })
}

async function deleteCustomer(customerId) {
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('customerId', sql.TYPES.VarChar, customerId)
         .query('DELETE KHACHHANG WHERE MaKH = @customerId')
   })
}

module.exports = {
   createCustomer,
   getCustomerAndRolesByAccountId,
   getCustomerById,
   getCustomerByEmail,
   getAllCustomers,
   updateCustomer,
   deleteCustomer,
}
