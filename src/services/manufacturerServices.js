const sql = require('mssql')
const connectionPool = require('../config/dbConfig')
const { CreateKey } = require('../utils/lib')
const fsPromises = require('fs/promises')
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

async function getAllManufacsByCategoryId(categoryId) {
   return await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('categoryId', sql.TYPES.VarChar, categoryId)
            .query(
               `SELECT NHASANXUAT.MANSX, TENNSX  FROM NHASANXUAT INNER JOIN SANPHAM ON NHASANXUAT.MANSX = SANPHAM.MANSX WHERE MADM = @categoryId GROUP BY NHASANXUAT.MANSX, TENNSX`,
            ),
      )
      .then((manufacs) => manufacs.recordset)
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

   if (!manufacturer) {
      throw new Error('Manufacturer not found')
   }

   if (manufacturer.ANHNSX) {
      const filePath = path.join(__dirname, `../public/images/${manufacturer.ANHNSX}`)
      fsPromises.unlink(filePath).catch((err) => console.log('File not found!'))
   }

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
   const manufacturer = await getManufacById(manufacId)
   if (manufacturer.ANHNSX) {
      const filePath = path.join(__dirname, `../public/images/${manufacturer.ANHNSX}`)
      fsPromises.unlink(filePath)
   }
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
   getAllManufacsByCategoryId,
   getAllManufacs,
   createManufac,
   updateManufac,
   deleteManufac,
}
