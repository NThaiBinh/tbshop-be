const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')

const columns = ['MALOAISP', 'TENLOAISP']

async function getAllProductTypes() {
   return await connectionPool
      .then((pool) => {
         return pool.request().query('SELECT * FROM LOAISP')
      })
      .then((productTypes) => productTypes.recordset)
}

async function getProductTypeById(productTypeId) {
   return await connectionPool
      .then((pool) => {
         return pool.request().input('productTypeId', sql.TYPES.VarChar, productTypeId).query('SELECT * FROM LOAISP WHERE MALOAISP = @productTypeId')
      })
      .then((productType) => productType.recordset[0])
}

async function createProductType(data) {
   const { name } = data
   const productTypeId = CreateKey('L_')
   return await connectionPool.then((pool) => {
      return pool.request().input('productTypeId', sql.TYPES.VarChar, productTypeId).input('name', sql.TYPES.NVarChar, name)
         .query(`INSERT INTO LOAISP (${columns}) VALUES (
                    @productTypeId, 
                    @name)`)
   })
}

async function updateProductType(data) {
   const { productTypeId, name } = data
   const updatedAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productTypeId', sql.TYPES.VarChar, productTypeId)
         .input('name', sql.TYPES.NVarChar, name)
         .query(
            `UPDATE LOAISP SET  
            ${columns[1]} = @name
            WHERE ${columns[0]} = @productTypeId`,
         )
   })
}

async function deleteProductType(productTypeId) {
   await connectionPool.then((pool) => {
      return pool.request().input('productTypeId', sql.TYPES.VarChar, productTypeId).query(`DELETE LOAISP WHERE MaLoaiSP = @productTypeId`)
   })
}

module.exports = {
   getAllProductTypes,
   getProductTypeById,
   createProductType,
   updateProductType,
   deleteProductType,
}
