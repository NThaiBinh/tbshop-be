const sql = require('mssql')
const connectionPool = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')
const fs = require('fs')
const path = require('path')

const columns = ['MANSX', 'TENNSX', 'ANHNSX', 'DIACHINSX', 'SDTNSX', 'EMAILNSX']

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

async function getAllManufacs() {
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT * FROM NHASANXUAT`)
      })
      .then((manufacs) => manufacs.recordset)
}

async function createManufac(data) {
   const { name, address, phoneNumber, email, fileName } = data
   const manufacId = CreateKey('NSX_')
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('image', sql.TYPES.VarChar, fileName).query(`INSERT INTO NHASANXUAT (${columns}) VALUES (
                    @manufacId,
                    @name,
                    @image,
                    @address,
                    @phoneNumber,
                    @email)`)
   })
}

async function updateManufac(data) {
   const { manufacId, name, address, phoneNumber, email, image } = data
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
         .input('image', sql.TYPES.VarChar, image)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('address', sql.TYPES.NVarChar, address).query(`UPDATE NHASANXUAT SET
                    ${columns[1]} = @name,
                    ${columns[2]} = @image,
                    ${columns[3]} = @address,
                    ${columns[4]} = @phoneNumber,
                    ${columns[5]} = @email
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
