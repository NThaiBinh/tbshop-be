const sql = require('mssql')
const connectionPool = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')
const fs = require('fs')
const path = require('path')
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
   const columns = ['MaNSX', 'TenNSX', 'DiaChiNSX', 'SDTNSX', 'EmailNSX', 'AnhNSX', 'NgayTao', 'NgayCapNhat']
   const { name, address, phoneNumber, email, fileName } = data
   const manufacId = CreateKey('NSX_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('image', sql.TYPES.VarChar, fileName)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO NHASANXUAT (${columns}) VALUES (
                    @manufacId,
                    @name,
                    @address,
                    @phoneNumber,
                    @email,
                    @image,
                    @createdAt,
                    @updatedAt)`)
   })
}

async function updateManufac(data) {
   const columns = ['MaNSX', 'TenNSX', 'DiaChiNSX', 'SDTNSX', 'EmailNSX', 'AnhNSX', 'NgayCapNhat']
   const { manufacId, name, address, phoneNumber, email, image } = data

   const updatedAt = GetDate()
   const manufacturer = await getManufacById(manufacId)

   fs.unlink(path.join(__dirname, `../public/images/${manufacturer.ANHNSX}`), (err) => {
      if (err) {
         console.log('Loi', err)
      }
   })

   return connectionPool.then((pool) => {
      return pool
         .request()
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('image', sql.TYPES.VarChar, image)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`UPDATE NHASANXUAT SET
                    ${columns[1]} = @name,
                    ${columns[2]} = @address,
                    ${columns[3]} = @phoneNumber,
                    ${columns[4]} = @email,
                    ${columns[5]} = @image,
                    ${columns[6]} = @updatedAt
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
