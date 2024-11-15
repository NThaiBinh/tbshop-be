const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')

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
         return pool
            .request()
            .input('productTypeId', sql.TYPES.VarChar, productTypeId)
            .query('SELECT * FROM LOAISP WHERE MALOAISP = @productTypeId')
      })
      .then((productType) => productType.recordset[0])
}

async function createProductType(data) {
   const columns = ['MaLoaiSP', 'TenLoaiSP', 'NgayTao', 'NgayCapNhat']
   const { name } = data
   const productTypeId = CreateKey('L_')
   const createAt = GetDate()
   const updateAt = GetDate()
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productTypeId', sql.TYPES.VarChar, productTypeId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('createAt', sql.TYPES.DateTimeOffset, createAt)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`INSERT INTO LOAISP (${columns}) VALUES (
                    @productTypeId, 
                    @name, 
                    @createAt,
                    @updateAt)`)
   })
}

async function updateProductType(data) {
   const columns = ['MaLoaiSP', 'TenLoaiSP', 'NgayTao', 'NgayCapNhat']
   const { productTypeId, name } = data
   const updateAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productTypeId', sql.TYPES.VarChar, productTypeId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt)
         .query(
            `UPDATE LOAISP SET  
            ${columns[1]} = @name, 
            ${columns[3]} = @updateAt
            WHERE ${columns[0]} = @productTypeId`,
         )
   })
}

async function deleteProductType(productTypeId) {
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productTypeId', sql.TYPES.VarChar, productTypeId)
         .query(`DELETE LOAISP WHERE MaLoaiSP = @productTypeId`)
   })
}

module.exports = {
   getAllProductTypes,
   getProductTypeById,
   createProductType,
   updateProductType,
   deleteProductType,
}
