const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')

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

async function createEmployee(data) {
   const columns = ['MaNV', 'MaCV', 'TenNV', 'NgaySinhNV', 'DiaChiNV', 'SDTNV', 'EmailNV', 'NgayTao', 'NgayCapNhat']
   const { positionId, name, birdth, address, phoneNumber, email } = data
   const employeeId = CreateKey('NV_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('employeeId', sql.TYPES.VarChar, employeeId)
         .input('positionId', sql.TYPES.VarChar, positionId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('birdth', sql.TYPES.DateTimeOffset, birdth)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO NHANVIEN (${columns}) VALUES (
                    @employeeId,
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
}
