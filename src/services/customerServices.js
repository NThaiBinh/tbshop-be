require('dotenv').config()
const fsPromises = require('fs/promises')
const path = require('path')
const { connectionPool, executeQuery } = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')
const sql = require('mssql')
const { getRoleByAccountId } = require('./accessPermissionServices')

const columns = ['MAKH', 'MATK', 'TENKH', 'ANHKH', 'NGAYSINHKH', 'SDTKH', 'EMAILKH', 'NGAYTAO', 'NGAYCAPNHAT']
const addressColumns = ['MADIACHI', 'MAKH', 'DIACHIGIAO', 'MACDINH']

async function createCustomer(customerInfo) {
   const { accountId, name, image, birth, address, phoneNumber, email } = customerInfo
   const customerId = CreateKey('KH_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('customerId', sql.TYPES.VarChar, customerId)
   //       .input('accountId', sql.TYPES.VarChar, accountId)
   //       .input('name', sql.TYPES.NVarChar, name)
   //       .input('image', sql.TYPES.VarChar, image)
   //       .input('birth', sql.TYPES.VarChar, birth)
   //       .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
   //       .input('email', sql.TYPES.VarChar, email)
   //       .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
   //       .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO KHACHHANG (${columns}) VALUES(
   //                  @customerId,
   //                  @accountId,
   //                  @name,
   //                  @image,
   //                  @birth,
   //                  @phoneNumber,
   //                  @email,
   //                  @createdAt,
   //                  @updatedAt)`)
   // })
   const params = [
      { name: 'customerId', type: sql.TYPES.VarChar, value: customerId },
      { name: 'accountId', type: sql.TYPES.VarChar, value: accountId },
      { name: 'name', type: sql.TYPES.NVarChar, value: name },
      { name: 'image', type: sql.TYPES.VarChar, value: image },
      { name: 'birth', type: sql.TYPES.VarChar, value: birth },
      { name: 'phoneNumber', type: sql.TYPES.VarChar, value: phoneNumber },
      { name: 'email', type: sql.TYPES.VarChar, value: email },
      { name: 'createdAt', type: sql.TYPES.DateTimeOffset, value: createdAt },
      { name: 'updatedAt', type: sql.TYPES.DateTimeOffset, value: updatedAt },
   ]
   const query = `
      INSERT INTO KHACHHANG (${columns}) VALUES(
         @customerId,
         @accountId,
         @name,
         @image,
         @birth,
         @phoneNumber,
         @email,
         @createdAt,
         @updatedAt)`
   await executeQuery(query, params)
   if (address) {
      await createCustomerAddress(customerId, address)
   }
   return customerId
}

async function createCustomerAddress(customerId, address) {
   const customerAddress = await getAllCustomerAddress(customerId)
   const addressId = CreateKey('DC_')
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('addressId', sql.TYPES.VarChar, addressId)
   //       .input('customerId', sql.TYPES.VarChar, customerId)
   //       .input('address', sql.TYPES.NVarChar, address)
   //       .input('isDefault', sql.TYPES.Bit, customerAddress.length === 0)
   //       .query(`INSERT INTO DIACHIGIAOHANG (${addressColumns}) VALUES (
   //          @addressId,
   //          @customerId,
   //          @address,
   //          @isDefault)`),
   // )
   const params = [
      { name: 'addressId', type: sql.TYPES.VarChar, value: addressId },
      { name: 'customerId', type: sql.TYPES.VarChar, value: customerId },
      { name: 'address', type: sql.TYPES.NVarChar, value: address },
      { name: 'isDefault', type: sql.TYPES.Bit, value: customerAddress.length === 0 },
   ]
   const query = `
      INSERT INTO DIACHIGIAOHANG (${addressColumns}) VALUES (
         @addressId,
         @customerId,
         @address,
         @isDefault)`
   await executeQuery(query, params)
}

async function getAllCustomerAddress(customerId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool
   //          .request()
   //          .input('customerId', sql.TYPES.VarChar, customerId)
   //          .query(`SELECT * FROM DIACHIGIAOHANG WHERE MAKH = @customerId`),
   //    )
   //    .then((customerAddress) => customerAddress.recordset)
   const params = [{ name: 'customerId', type: sql.TYPES.VarChar, value: customerId }]
   const query = `SELECT * FROM DIACHIGIAOHANG WHERE MAKH = @customerId`
   return await executeQuery(query, params)
}

async function updateDefaultCustomerAddress(addressId) {
   // await connectionPool.then((pool) =>
   //    pool.request().query(`UPDATE DIACHIGIAOHANG SET MACDINH = 'False'  WHERE MACDINH = 'True'`),
   // )

   // await connectionPool
   //    .then((pool) =>
   //       pool
   //          .request()
   //          .input('addressId', sql.TYPES.VarChar, addressId)
   //          .query(`UPDATE DIACHIGIAOHANG SET MACDINH = 'True'  WHERE MADIACHI = @addressId`),
   //    )
   //    .then((customerAddress) => customerAddress.recordset)
   await executeQuery(`UPDATE DIACHIGIAOHANG SET MACDINH = 'False' WHERE MACDINH = 'True'`)
   const params = [{ name: 'addressId', type: sql.TYPES.VarChar, value: addressId }]
   await executeQuery(`UPDATE DIACHIGIAOHANG SET MACDINH = 'True' WHERE MADIACHI = @addressId`, params)
}

async function deleteCustomerAddress(addressId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool
   //          .request()
   //          .input('addressId', sql.TYPES.VarChar, addressId)
   //          .query(`DELETE DIACHIGIAOHANG WHERE MADIACHI = @addressId`),
   //    )
   //    .then((customerAddress) => customerAddress.recordset)
   const params = [{ name: 'addressId', type: sql.TYPES.VarChar, value: addressId }]
   const query = `DELETE DIACHIGIAOHANG WHERE MADIACHI = @addressId`
   await executeQuery(query, params)
}

async function getCustomerAndRolesByAccountId(accountId) {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool.request().input('accountId', sql.TYPES.VarChar, accountId)
   //          .query(`SELECT *, (SELECT MAVAITRO FROM CO_VAI_TRO WHERE CO_VAI_TRO.MATK = KHACHHANG.MATK FOR JSON PATH) as QUYEN
   //             FROM KHACHHANG WHERE KHACHHANG.MATK = @accountId`)
   //    })
   //    .then((customerInfo) => {
   //       const roles = customerInfo.recordset[0].QUYEN ? JSON.parse(customerInfo.recordset[0].QUYEN) : []
   //       return {
   //          ...customerInfo.recordset[0],
   //          QUYEN: roles.map((role) => role.MAVAITRO),
   //       }
   //    })
   const params = [{ name: 'accountId', type: sql.TYPES.VarChar, value: accountId }]
   const query = `
      SELECT 
         *, 
         (SELECT MAVAITRO FROM CO_VAI_TRO WHERE CO_VAI_TRO.MATK = KHACHHANG.MATK FOR JSON PATH) as QUYEN
      FROM 
         KHACHHANG WHERE KHACHHANG.MATK = @accountId`
   const results = await executeQuery(query, params)
   const roles = results[0].QUYEN ? JSON.parse(results[0].QUYEN) : []
   return {
      ...results[0],
      QUYEN: roles.map((role) => role.MAVAITRO),
   }
}

async function getCustomerById(customerId) {
   // const customerInfo = await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .input('customerId', sql.TYPES.VarChar, customerId)
   //          .query(`SELECT * FROM KHACHHANG WHERE MaKH = @customerId`)
   //    })
   //    .then((customer) => customer.recordset[0])
   // const customerRoles = await getRoleByAccountId(customerInfo?.MATK)
   // return {
   //    ...customerInfo,
   //    roles: customerRoles.map((customerRole) => customerRole.MAVAITRO),
   // }
   const params = [{ name: 'customerId', type: sql.TYPES.VarChar, value: customerId }]
   const query = `SELECT * FROM KHACHHANG WHERE MaKH = @customerId`
   const customerInfo = await executeQuery(query, params)
   const customerRoles = await getRoleByAccountId(customerInfo?.MATK)
   return {
      ...customerInfo,
      roles: customerRoles.map((role) => role.MAVAITRO),
   }
}

async function getCustomerByEmail(email) {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .input('email', sql.TYPES.VarChar, email)
   //          .query(`SELECT * FROM KHACHHANG WHERE EMAILKH = @email`)
   //    })
   //    .then((customer) => customer.recordset[0])
   const params = [{ name: 'email', type: sql.TYPES.VarChar, value: email }]
   const query = `SELECT * FROM KHACHHANG WHERE EMAILKH = @email`
   const results = await executeQuery(query, params)
   return results[0]
}

async function getAllCustomers(page) {
   // if (page) {
   //    const PAGE_SIZE = 10
   //    const skip = (parseInt(page) - 1) * PAGE_SIZE
   //    return await connectionPool
   //       .then((pool) => {
   //          return pool.request().query(`SELECT * FROM KHACHHANG
   //                  ORDER BY NgayTao
   //                  OFFSET ${skip} ROWS
   //                  FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
   //       })
   //       .then((customers) => {
   //          return customers.recordset
   //       })
   // }
   // return await connectionPool
   //    .then((pool) => {
   //       return pool.request().query(`SELECT * FROM KHACHHANG`)
   //    })
   //    .then((customers) => {
   //       return customers.recordset
   //    })

   const params = []
   const query = 'SELECT * FROM KHACHHANG ORDER BY NGAYTAO'
   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      query += ' OFFSET @skip ROWS FETCH NEXT @page_size ROWS ONLY'
      params.push(
         { name: 'skip', type: sql.TYPES.Int, value: skip },
         { name: 'page_size', type: sql.TYPES.Int, value: PAGE_SIZE },
      )
   }
   return await executeQuery(query, params)
}

async function updateCustomer(data) {
   const { customerId, name, customerImage, birth, phoneNumber, email } = data
   const updatedAt = GetDate()
   const customerInfo = await getCustomerById(customerId)
   //Xoa anh tren server
   if (customerInfo.ANHKH) {
      const filePath = path.join(__dirname, `../public/images/${customerInfo.ANHKH}`)
      fsPromises.unlink(filePath)
   }

   const params = [
      { name: 'customerId', type: sql.TYPES.VarChar, value: customerId },
      { name: 'name', type: sql.TYPES.NVarChar, value: name },
      { name: 'customerImage', type: sql.TYPES.VarChar, value: customerImage },
      { name: 'birth', type: sql.TYPES.DateTimeOffset, value: birth },
      { name: 'phoneNumber', type: sql.TYPES.VarChar, value: phoneNumber },
      { name: 'email', type: sql.TYPES.VarChar, value: email },
      { name: 'updatedAt', type: sql.TYPES.DateTimeOffset, value: updatedAt },
   ]
   const query = `
      UPDATE KHACHHANG SET
         ${columns[2]} = @name,
         ${columns[3]} = @customerImage,
         ${columns[4]} = @birth,
         ${columns[5]} = @phoneNumber,
         ${columns[6]} = @email,
         ${columns[8]} = @updatedAt
      WHERE ${columns[0]} = @customerId`
   await executeQuery(query, params)
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('customerId', sql.TYPES.VarChar, customerId)
   //       .input('name', sql.TYPES.NVarChar, name)
   //       .input('customerImage', sql.TYPES.VarChar, customerImage)
   //       .input('birth', sql.TYPES.DateTimeOffset, birth)
   //       .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
   //       .input('email', sql.TYPES.VarChar, email)
   //       .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`UPDATE KHACHHANG SET
   //              ${columns[2]} = @name,
   //              ${columns[3]} = @customerImage,
   //              ${columns[4]} = @birth,
   //              ${columns[5]} = @phoneNumber,
   //              ${columns[6]} = @email,
   //              ${columns[8]} = @updatedAt
   //              WHERE ${columns[0]} = @customerId`)
   // })
}

async function deleteCustomer(customerId) {
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('customerId', sql.TYPES.VarChar, customerId)
   //       .query('DELETE KHACHHANG WHERE MaKH = @customerId')
   // })

   const params = [{ name: 'customerId', type: sql.TYPES.VarChar, value: customerId }]
   const query = 'DELETE KHACHHANG WHERE MAKH = @customerId'
   await executeQuery(query, params)
}

module.exports = {
   createCustomer,
   getCustomerAndRolesByAccountId,
   getCustomerById,
   getCustomerByEmail,
   getAllCustomers,
   updateCustomer,
   deleteCustomer,
   createCustomerAddress,
   getAllCustomerAddress,
   deleteCustomerAddress,
   updateDefaultCustomerAddress,
}
