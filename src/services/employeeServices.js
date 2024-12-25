const { connectionPool, executeQuery } = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')
const { getRoleByAccountId } = require('./accessPermissionServices')

const columns = [
   'MANV',
   'MATK',
   'MACV',
   'TENNV',
   'ANHNV',
   'NGAYSINHNV',
   'DIACHINV',
   'SDTNV',
   'EMAILNV',
   'NGAYTAO',
   'NGAYCAPNHAT',
]

async function getAllEmployees() {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool.request().query(`
   //          SELECT MANV, MATK, NHANVIEN.MACV, TENCV, TENNV, ANHNV, NGAYSINHNV, DIACHINV, SDTNV, EMAILNV, NGAYTAO, NGAYCAPNHAT
   //          FROM NHANVIEN INNER JOIN CHUCVU ON NHANVIEN.MACV = CHUCVU.MACV`)
   //    })
   //    .then((employees) => employees.recordset)
   const params = []
   const query = `
      SELECT 
         MANV,
         MATK, 
         NHANVIEN.MACV, 
         TENCV, 
         TENNV, 
         ANHNV, 
         NGAYSINHNV, 
         DIACHINV, 
         SDTNV, 
         EMAILNV, 
         NGAYTAO, 
         NGAYCAPNHAT
      FROM 
         NHANVIEN 
         INNER JOIN CHUCVU ON NHANVIEN.MACV = CHUCVU.MACV`
   return await executeQuery(query, params)
}

async function getEmployeeInfoByAccountId(accountId) {
   // const employeeInfo = await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .input('accountId', sql.TYPES.VarChar, accountId)
   //          .query(`SELECT * FROM NHANVIEN WHERE NHANVIEN.MATK = @accountId`)
   //    })
   //    .then((employeeInfo) => employeeInfo.recordset[0])
   // const employeeRoles = await getRoleByAccountId(accountId)
   // return {
   //    ...employeeInfo,
   //    roles: employeeRoles.map((employeeRole) => employeeRole.MAVAITRO),
   // }
   const params = [{ name: 'accountId', type: sql.TYPES.VarChar, value: accountId }]
   const query = `SELECT * FROM NHANVIEN WHERE NHANVIEN.MATK = @accountId`
   const employeeInfo = await executeQuery(query, params)
   const employeeRoles = await getRoleByAccountId(accountId)
   return {
      ...employeeInfo,
      roles: employeeRoles?.map((employeeRole) => employeeRole.MAVAITRO),
   }
}

async function getEmployeeInfoById(employeeId) {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .input('employeeId', sql.TYPES.VarChar, employeeId)
   //          .query(`SELECT * FROM NHANVIEN WHERE MANV = @employeeId`)
   //    })
   //    .then((employeeInfo) => employeeInfo.recordset[0])
   const params = [{ name: 'employeeId', type: sql.TYPES.VarChar, value: employeeId }]
   const query = `SELECT * FROM NHANVIEN WHERE MANV = @employeeId`
   const results = await executeQuery(query, params)
   return results[0]
}

async function getEmployeeAndRolesByAccountId(accountId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool
   //          .request()
   //          .input('accountId', sql.TYPES.VarChar, accountId)
   //          .query(
   //             `SELECT *, (SELECT MAVAITRO FROM CO_VAI_TRO WHERE CO_VAI_TRO.MATK = NHANVIEN.MATK FOR JSON PATH) as QUYEN
   //             FROM NHANVIEN WHERE NHANVIEN.MATK = @accountId`,
   //          ),
   //    )
   //    .then((employeeInfo) => {
   //       const roles = employeeInfo.recordset[0].QUYEN ? JSON.parse(employeeInfo.recordset[0].QUYEN) : []
   //       return {
   //          ...employeeInfo.recordset[0],
   //          QUYEN: roles.map((role) => role.MAVAITRO),
   //       }
   //    })
   const params = [{ name: 'accountId', type: sql.TYPES.VarChar, value: accountId }]
   const query = `
      SELECT 
         *, 
         (SELECT MAVAITRO FROM CO_VAI_TRO WHERE CO_VAI_TRO.MATK = NHANVIEN.MATK FOR JSON PATH) as QUYEN
      FROM 
         NHANVIEN 
      WHERE 
         NHANVIEN.MATK = @accountId`
   const results = await executeQuery(query, params)
   const roles = results[0].QUYEN ? JSON.parse(results[0].QUYEN) : []
   return {
      ...results[0],
      QUYEN: roles.map((role) => role.MAVAITRO),
   }
}

async function createEmployee(employeeInfo) {
   const { accountId, positionId, name, image, birth, address, phoneNumber, email } = employeeInfo
   const employeeId = CreateKey('NV_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('employeeId', sql.TYPES.VarChar, employeeId)
   //       .input('accountId', sql.TYPES.VarChar, accountId)
   //       .input('positionId', sql.TYPES.VarChar, positionId)
   //       .input('name', sql.TYPES.NVarChar, name)
   //       .input('image', sql.TYPES.VarChar, image)
   //       .input('birth', sql.TYPES.DateTimeOffset, birth)
   //       .input('address', sql.TYPES.NVarChar, address)
   //       .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
   //       .input('email', sql.TYPES.VarChar, email)
   //       .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
   //       .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO NHANVIEN (${columns}) VALUES (
   //                  @employeeId,
   //                  @accountId,
   //                  @positionId,
   //                  @name,
   //                  @image,
   //                  @birth,
   //                  @address,
   //                  @phoneNumber,
   //                  @email,
   //                  @createdAt,
   //                  @updatedAt)`)
   // })
   const params = [
      { name: 'employeeId', type: sql.TYPES.VarChar, value: employeeId },
      { name: 'accountId', type: sql.TYPES.VarChar, value: accountId },
      { name: 'positionId', type: sql.TYPES.VarChar, value: positionId },
      { name: 'name', type: sql.TYPES.NVarChar, value: name },
      { name: 'image', type: sql.TYPES.VarChar, value: image },
      { name: 'birth', type: sql.TYPES.DateTimeOffset, value: birth },
      { name: 'address', type: sql.TYPES.NVarChar, value: address },
      { name: 'phoneNumber', type: sql.TYPES.VarChar, value: phoneNumber },
      { name: 'email', type: sql.TYPES.VarChar, value: email },
      { name: 'createdAt', type: sql.TYPES.DateTimeOffset, value: createdAt },
      { name: 'updatedAt', type: sql.TYPES.DateTimeOffset, value: updatedAt },
   ]
   const query = `
      INSERT INTO NHANVIEN (${columns}) VALUES (
         @employeeId,
         @accountId,
         @positionId,
         @name,
         @image,
         @birth,
         @address,
         @phoneNumber,
         @email,
         @createdAt,
         @updatedAt)`
   await executeQuery(query, params)
}

async function updateEmployee(employeeInfo) {
   const { employeeId, positionId, name, image, birth, address, phoneNumber, email } = employeeInfo
   const updatedAt = GetDate()
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('employeeId', sql.TYPES.VarChar, employeeId)
   //       .input('positionId', sql.TYPES.VarChar, positionId)
   //       .input('name', sql.TYPES.NVarChar, name)
   //       .input('image', sql.TYPES.VarChar, image)
   //       .input('birth', sql.TYPES.DateTimeOffset, birth)
   //       .input('address', sql.TYPES.NVarChar, address)
   //       .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
   //       .input('email', sql.TYPES.VarChar, email)
   //       .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`
   //          UPDATE
   //             NHANVIEN
   //          SET
   //             ${columns[2]} = @positionId,
   //             ${columns[3]} = @name,
   //             ${columns[4]} = @image,
   //             ${columns[5]} = @birth,
   //             ${columns[6]} = @address,
   //             ${columns[7]} = @phoneNumber,
   //             ${columns[8]} = @email,
   //             ${columns[10]} = @updatedAt
   //          WHERE
   //             MANV = @employeeId`)
   // })
   const params = [
      { name: 'employeeId', type: sql.TYPES.VarChar, employeeId },
      { name: 'positionId', type: sql.TYPES.VarChar, positionId },
      { name: 'name', type: sql.TYPES.VarChar, name },
      { name: 'image', type: sql.TYPES.VarChar, image },
      { name: 'birth', type: sql.TYPES.DateTimeOffset, birth },
      { name: 'address', type: sql.TYPES.NVarChar, address },
      { name: 'phoneNumber', type: sql.TYPES.VarChar, phoneNumber },
      { name: 'email', type: sql.TYPES.VarChar, email },
      { name: 'updatedAt', type: sql.TYPES.DateTimeOffset, updatedAt },
   ]
   const query = `
      UPDATE
         NHANVIEN
      SET
         ${columns[2]} = @positionId,
         ${columns[3]} = @name,
         ${columns[4]} = @image,
         ${columns[5]} = @birth,
         ${columns[6]} = @address,
         ${columns[7]} = @phoneNumber,
         ${columns[8]} = @email,
         ${columns[10]} = @updatedAt
      WHERE
         MANV = @employeeId`
   await executeQuery(query, params)
}

async function deleteEmployee(employeeId, accountId) {
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('accountId', sql.TYPES.VarChar, accountId)
   //       .query(`DELETE CO_VAI_TRO WHERE MATK = @accountId`),
   // )
   // await connectionPool.then((pool) => {
   //    return pool.request().input('employeeId', sql.TYPES.VarChar, employeeId).query(`
   //          DELETE
   //             NHANVIEN
   //          WHERE
   //             MANV = @employeeId`)
   // })
   // await connectionPool.then((pool) =>
   //    pool.request().input('accountId', sql.TYPES.VarChar, accountId).query(`DELETE TAIKHOAN WHERE MATK = @accountId`),
   // )
   await executeQuery('DELETE CO_VAI_TRO WHERE MATK = @accountId', [
      { name: 'accountId', type: sql.TYPES.VarChar, accountId },
   ])
   await executeQuery('DELETE NHANVIEN WHERE MANV = @employeeId', [
      { name: 'employeeId', type: sql.TYPES.VarChar, employeeId },
   ])
   await executeQuery('DELETE TAIKHOAN WHERE MATK = @accountId', [
      { name: 'accountId', type: sql.TYPES.VarChar, accountId },
   ])
}

module.exports = {
   getAllEmployees,
   createEmployee,
   getEmployeeInfoByAccountId,
   getEmployeeAndRolesByAccountId,
   updateEmployee,
   deleteEmployee,
   getEmployeeInfoById,
}
