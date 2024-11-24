const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')
const { getRoleByAccountId } = require('./accessPermissionServices')

const columns = [
   'MANV',
   'MATK',
   'MACV',
   'TenNV',
   'NGAYSINHNV',
   'DIACHINV',
   'SDTNV',
   'EMAILNV',
   'NGAYTAO',
   'NGAYCAPNHAT',
]

async function getAllEmployees(page) {
   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      return await connectionPool
         .then((pool) => {
            return pool.request().query(`SELECT * FROM NHANVIEN
                        ORDER BY NgayTao
                        OFFSET ${skip} ROWS
                        FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
         })
         .then((employees) => employees.recordset)
   }
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT * FROM NHANVIEN`)
      })
      .then((employees) => employees.recordset)
}

async function getEmployeeInfoByAccountId(accountId) {
   const employeeInfo = await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('accountId', sql.TYPES.VarChar, accountId)
            .query(`SELECT * FROM NHANVIEN WHERE NHANVIEN.MATK = @accountId`)
      })
      .then((employeeInfo) => employeeInfo.recordset[0])
   const employeeRoles = await getRoleByAccountId(accountId)
   return {
      ...employeeInfo,
      roles: employeeRoles.map((employeeRole) => employeeRole.MAVAITRO),
   }
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
   const { accountId, positionId, name, birdth, address, phoneNumber, email } = employeeInfo
   const employeeId = CreateKey('NV_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('employeeId', sql.TYPES.VarChar, employeeId)
         .input('accountId', sql.TYPES.VarChar, accountId)
         .input('positionId', sql.TYPES.VarChar, positionId)
         .input('name', sql.TYPES.NVarChar, name)
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
                    @birdth,
                    @address,
                    @phoneNumber,
                    @email,
                    @createdAt,
                    @updatedAt)`)
   })
}

module.exports = {
   getAllEmployees,
   createEmployee,
   getEmployeeInfoByAccountId,
   getEmployeeAndRolesByAccountId,
}
