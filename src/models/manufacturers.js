const sql = require('mssql')
const connectionPool = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')

async function getManufacById(manufacId) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('manufacId', sql.TYPES.VarChar, manufacId)
            .query(`SELECT * FROM NHASANXUAT WHERE MaNSX = @manufacId`)
      })
      .then((manufac) => manufac.recordset[0])
}

async function getManufacByEmail(email) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('email', sql.TYPES.VarChar, email)
            .query(`SELECT * FROM NHASANXUAT WHERE EmailNSX = @email`)
      })
      .then((manufac) => manufac.recordset[0])
}

async function getAllManufacs(page) {
   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      return await connectionPool
         .then((pool) => {
            return pool.request().query(`SELECT * FROM NHASANXUAT 
                        ORDER BY NgayTao
                        OFFSET ${skip} ROWS
                        FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
         })
         .then((manufacs) => manufacs.recordset)
   }
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT * FROM NHASANXUAT`)
      })
      .then((manufacs) => manufacs.recordset)
}

async function createManufac(data) {
   const columns = ['MaNSX', 'TenNSX', 'DiaChiNSX', 'SDTNSX', 'EmailNSX', 'NgayTao', 'NgayCapNhat']
   const { name, address, phoneNumber, email } = data
   const manufacId = CreateKey('NSX_')
   const createAt = GetDate()
   const updateAt = GetDate()
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('createAt', sql.TYPES.DateTimeOffset, createAt)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`INSERT INTO NHASANXUAT (${columns}) VALUES (
                    @manufacId,
                    @name,
                    @address,
                    @phoneNumber,
                    @email,
                    @createAt,
                    @updateAt)`)
   })
}

async function updateManufac(data) {
   const columns = ['MaNSX', 'TenNSX', 'DiaChiNSX', 'SDTNSX', 'EmailNSX', 'NgayCapNhat']
   const { manufacId, name, address, phoneNumber, email } = data
   const updateAt = GetDate()
   console.log(updateAt)
   return connectionPool.then((pool) => {
      return pool
         .request()
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`UPDATE NHASANXUAT SET
                    ${columns[1]} = @name,
                    ${columns[2]} = @address,
                    ${columns[3]} = @phoneNumber,
                    ${columns[4]} = @email,
                    ${columns[5]} = @updateAt
                    WHERE ${columns[0]} = @manufacId`)
   })
}

async function deleteManufac(manufacId) {
   return connectionPool.then((pool) => {
      return pool
         .request()
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .query(`DELETE NHASANXUAT WHERE MaNSX = @manufacId`)
   })
}

module.exports = {
   getManufacById,
   getManufacByEmail,
   getAllManufacs,
   createManufac,
   updateManufac,
   deleteManufac,
}