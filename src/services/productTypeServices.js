const { connectionPool, executeQuery } = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')

const columns = ['MALOAISP', 'TENLOAISP']

async function getAllProductTypes() {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool.request().query('SELECT * FROM LOAISP')
   //    })
   //    .then((productTypes) => productTypes.recordset)
   return executeQuery('SELECT * FROM  LOAISP')
}

async function getProductTypeById(productTypeId) {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .input('productTypeId', sql.TYPES.VarChar, productTypeId)
   //          .query('SELECT * FROM LOAISP WHERE MALOAISP = @productTypeId')
   //    })
   //    .then((productType) => productType.recordset[0])
   const params = [{ name: 'productTypeId', type: sql.TYPES.VarChar, value: productTypeId }]
   const query = 'SELECT * FROM LOAISP WHERE MALOAISP = @productTypeId'
   const results = await executeQuery(query, params)
   return results[0]
}

async function createProductType(data) {
   const { name } = data
   const productTypeId = CreateKey('L_')
   // return await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('productTypeId', sql.TYPES.VarChar, productTypeId)
   //       .input('name', sql.TYPES.NVarChar, name).query(`INSERT INTO LOAISP (${columns}) VALUES (
   //                  @productTypeId,
   //                  @name)`)
   // })

   const params = [
      { name: 'productTypeId', type: sql.TYPES.VarChar, value: productTypeId },
      { name: 'name', type: sql.TYPES.NVarChar, value: name },
   ]
   const query = `INSERT INTO LOAISP (${columns}) VALUES (@productTypeId, @name)`
   executeQuery(query, params)
}

async function updateProductType(data) {
   const { productTypeId, name } = data
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('productTypeId', sql.TYPES.VarChar, productTypeId)
   //       .input('name', sql.TYPES.NVarChar, name)
   //       .query(
   //          `UPDATE LOAISP SET
   //          ${columns[1]} = @name
   //          WHERE ${columns[0]} = @productTypeId`,
   //       )
   // })

   const params = [
      { name: 'productTypeId', type: sql.TYPES.VarChar, value: productTypeId },
      { name: 'name', type: sql.TYPES.NVarChar, value: name },
   ]
   const query = `UPDATE LOAISP SET ${columns[1]} = @name WHERE ${columns[0]} = @productTypeId`
   executeQuery(query, params)
}

async function deleteProductType(productTypeId) {
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('productTypeId', sql.TYPES.VarChar, productTypeId)
   //       .query(`DELETE LOAISP WHERE MaLoaiSP = @productTypeId`)
   // })
   const params = [{ name: 'productTypeId', type: sql.TYPES.VarChar, value: productTypeId }]
   const query = 'DELETE LOAISP WHERE MaLoaiSP = @productTypeId'
   executeQuery(query, params)
}

module.exports = {
   getAllProductTypes,
   getProductTypeById,
   createProductType,
   updateProductType,
   deleteProductType,
}
