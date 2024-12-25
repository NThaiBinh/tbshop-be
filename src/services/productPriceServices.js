const { connectionPool, executeQuery } = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')
const columns = ['MAGIASP', 'MASP', 'GIASP', 'NGAYCAPNHATGIA']

async function createProductPrice(price, productId) {
   const priceId = CreateKey('GIA_')
   const createdAt = GetDate()
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('priceId', sql.TYPES.VarChar, priceId)
   //       .input('productId', sql.TYPES.VarChar, productId)
   //       .input('price', sql.TYPES.Float, price)
   //       .input('createdAt', sql.TYPES.DateTimeOffset, createdAt).query(`INSERT INTO GIASP (${columns}) VALUES (
   //                    @priceId,
   //                    @productId,
   //                    @price,
   //                    @createdAt)`)
   // })
   const params = [
      { name: 'priceId', type: sql.TYPES.VarChar, value: priceId },
      { name: 'productId', type: sql.TYPES.VarChar, value: productId },
      { name: 'price', type: sql.TYPES.Float, value: price },
      { name: 'createdAt', type: sql.TYPES.DateTimeOffset, value: createdAt },
   ]
   const query = `
      INSERT INTO GIASP (${columns}) VALUES (
         @priceId,
         @productId,
         @price,
         @createdAt)`
   await executeQuery(query, params)
}

async function getProductPrice(productId) {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .input('productId', sql.TYPES.VarChar, productId)
   //          .query('SELECT TOP 1 * FROM GIASP WHERE MASP = @productId ORDER BY NGAYCAPNHATGIA DESC')
   //    })
   //    .then((productPrice) => productPrice.recordset[0])
   const params = [{ name: 'productId', type: sql.TYPES.VarChar, value: productId }]
   const query = 'SELECT TOP 1 * FROM GIASP WHERE MASP = @productId ORDER BY NGAYCAPNHATGIA DESC'
   const results = await executeQuery(query, params)
   return results[0]
}

async function deleteProductPrice(productId) {
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('productId', sql.TYPES.VarChar, productId)
   //       .query('DELETE GIASP WHERE MASP = @productId')
   // })
   const params = [{ name: 'productId', type: sql.TYPES.VarChar, value: productId }]
   const query = 'DELETE GIASP WHERE MASP = @productId'
   await executeQuery(query, params)
}

module.exports = { createProductPrice, getProductPrice, deleteProductPrice }
