const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')
const { getRoleByAccountId } = require('./accessPermissionServices')

const columns = ['MANV', 'MATK', 'MACV', 'TENNV', 'ANHNV', 'NGAYSINHNV', 'DIACHINV', 'SDTNV', 'EMAILNV', 'NGAYTAO', 'NGAYCAPNHAT']

async function getAllEmployees() {
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`
            SELECT MANV, MATK, NHANVIEN.MACV, TENCV, TENNV, ANHNV, NGAYSINHNV, DIACHINV, SDTNV, EMAILNV, NGAYTAO, NGAYCAPNHAT 
            FROM NHANVIEN INNER JOIN CHUCVU ON NHANVIEN.MACV = CHUCVU.MACV`)
      })
      .then((employees) => employees.recordset)
}

async function getEmployeeInfoByAccountId(accountId) {
   const employeeInfo = await connectionPool
      .then((pool) => {
         return pool.request().input('accountId', sql.TYPES.VarChar, accountId).query(`SELECT * FROM NHANVIEN WHERE NHANVIEN.MATK = @accountId`)
      })
      .then((employeeInfo) => employeeInfo.recordset[0])
   const employeeRoles = await getRoleByAccountId(accountId)
   return {
      ...employeeInfo,
      roles: employeeRoles.map((employeeRole) => employeeRole.MAVAITRO),
   }
}

async function getEmployeeInfoById(employeeId) {
   return await connectionPool
      .then((pool) => {
         return pool.request().input('employeeId', sql.TYPES.VarChar, employeeId).query(`SELECT * FROM NHANVIEN WHERE MANV = @employeeId`)
      })
      .then((employeeInfo) => employeeInfo.recordset[0])
}

async function getEmployeeAndRolesByAccountId(accountId) {
   return await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('accountId', sql.TYPES.VarChar, accountId)
            .query(
               `SELECT *, (SELECT MAVAITRO FROM CO_VAI_TRO WHERE CO_VAI_TRO.MATK = NHANVIEN.MATK FOR JSON PATH) as QUYEN
               FROM NHANVIEN WHERE NHANVIEN.MATK = @accountId`,
            ),
      )
      .then((employeeInfo) => {
         const roles = employeeInfo.recordset[0].QUYEN ? JSON.parse(employeeInfo.recordset[0].QUYEN) : []
         return {
            ...employeeInfo.recordset[0],
            QUYEN: roles.map((role) => role.MAVAITRO),
         }
      })
}

async function createEmployee(employeeInfo) {
   const { accountId, positionId, name, image, birdth, address, phoneNumber, email } = employeeInfo
   const employeeId = CreateKey('NV_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('employeeId', sql.TYPES.VarChar, employeeId)
         .input('accountId', sql.TYPES.VarChar, accountId)
         .input('positionId', sql.TYPES.VarChar, positionId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('image', sql.TYPES.VarChar, image)
         .input('birdth', sql.TYPES.DateTimeOffset, birdth)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO NHANVIEN (${columns}) VALUES (
                    @employeeId,
                    @accountId,
                    @positionId,
                    @name,
                    @image,
                    @birdth,
                    @address,
                    @phoneNumber,
                    @email,
                    @createdAt,
                    @updatedAt)`)
   })
}

async function updateEmployee(employeeInfo) {
   const { employeeId, positionId, name, image, birth, address, phoneNumber, email } = employeeInfo
   const updatedAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('employeeId', sql.TYPES.VarChar, employeeId)
         .input('positionId', sql.TYPES.VarChar, positionId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('image', sql.TYPES.VarChar, image)
         .input('birth', sql.TYPES.DateTimeOffset, birth)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`
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
               MANV = @employeeId`)
   })
}

async function deleteEmployee(employeeId, accountId) {
   await connectionPool.then((pool) =>
      pool.request().input('accountId', sql.TYPES.VarChar, accountId).query(`DELETE CO_VAI_TRO WHERE MATK = @accountId`),
   )
   await connectionPool.then((pool) => {
      return pool.request().input('employeeId', sql.TYPES.VarChar, employeeId).query(`
            DELETE 
               NHANVIEN 
            WHERE
               MANV = @employeeId`)
   })
   await connectionPool.then((pool) =>
      pool.request().input('accountId', sql.TYPES.VarChar, accountId).query(`DELETE TAIKHOAN WHERE MATK = @accountId`),
   )
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
