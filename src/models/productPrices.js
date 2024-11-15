const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')

async function createProductPrice(price, productId) {
   const columsPrice = ['MAGIASP', 'MASP', 'GIASP', 'NGAYCAPNHATGIA']
   const priceId = CreateKey('GIA_')
   const createAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('priceId', sql.TYPES.VarChar, priceId)
         .input('productId', sql.TYPES.VarChar, productId)
         .input('price', sql.TYPES.Float, price)
         .input('createAt', sql.TYPES.DateTimeOffset, createAt).query(`INSERT INTO GIASP (${columsPrice}) VALUES (
                      @priceId, 
                      @productId, 
                      @price,
                      @createAt)`)
   })
}

async function getProductPrice(productId) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('productId', sql.TYPES.VarChar, productId)
            .query('SELECT TOP 1 * FROM GIASP WHERE MASP = @productId ORDER BY NGAYCAPNHATGIA DESC')
      })
      .then((productPrice) => productPrice.recordset[0])
}

async function deleteProductPrice(productId) {
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productId', sql.TYPES.VarChar, productId)
         .query('DELETE GIASP WHERE MASP = @productId')
   })
}

module.exports = { createProductPrice, getProductPrice, deleteProductPrice }
