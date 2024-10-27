const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')
const connectionPool = require('../config/dbConfig')

async function getProductById(productId) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('productId', sql.TYPES.VarChar, productId)
            .query(`SELECT * FROM SANPHAM WHERE MaSP = @productId`)
      })
      .then((product) => product.recordset[0])
}

async function getAllProductByCategory(categoryId) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('categoryId', sql.TYPES.VarChar, categoryId)
            .query(`SELECT * FROM SANPHAM WHERE MaDM = @categoryId`)
      })
      .then((product) => product.recordset)
}

async function getAllProducts(page) {
   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      return await connectionPool
         .then((pool) => {
            return pool.request().query(`
               SELECT SANPHAM.MASP, MADM, MANSX, TENSP, MOTASP, GIASP  
               FROM SANPHAM INNER JOIN GIASP ON SANPHAM.MASP = GIASP.MASP 
                        ORDER BY MaSP 
                        OFFSET ${skip} ROWS 
                        FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
         })
         .then((products) => products.recordset)
   }
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT SANPHAM.MASP, MADM, MANSX, TENSP, MOTASP, GIASP  
               FROM SANPHAM INNER JOIN GIASP ON SANPHAM.MASP = GIASP.MASP`)
      })
      .then((products) => products.recordset)
}

async function createProduct(data) {
   const columns = ['MASP', 'MADM', 'MANSX', 'TENSP', 'MOTASP', 'SOLUONGTON', 'NgayTao', 'NgayCapNhat']
   const { categoryId, manufacId, name, description, quantity } = data
   const productId = CreateKey('SP_')
   const createAt = GetDate()
   const updateAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productId', sql.TYPES.VarChar, productId)
         .input('categoryId', sql.TYPES.VarChar, categoryId)
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('description', sql.TYPES.NVarChar, description)
         .input('quantity', sql.TYPES.Int, quantity)
         .input('createAt', sql.TYPES.DateTimeOffset, createAt)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`INSERT INTO SANPHAM (${columns}) VALUES (
                    @productId, 
                    @categoryId, 
                    @manufacId, 
                    @name, 
                    @description, 
                    @quantity,
                    @createAt,
                    @updateAt)`)
   })
}

async function updateProduct(data) {
   const columns = ['MASP', 'MADM', 'MANSX', 'TENSP', 'MOTASP', 'SOLUONGTON', 'NgayCapNhat']
   const { productId, categoryId, manufacId, name, description, quantity } = data
   const updateAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productId', sql.TYPES.VarChar, productId)
         .input('categoryId', sql.TYPES.VarChar, categoryId)
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('description', sql.TYPES.NVarChar, description)
         .input('quantity', sql.TYPES.Int, quantity)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`UPDATE SANPHAM SET 
                    ${columns[1]} = @categoryId, 
                    ${columns[2]} = @manufacId, 
                    ${columns[3]} = @name, 
                    ${columns[4]} = @description, 
                    ${columns[5]} = @quantity,
                    ${columns[6]} = @updateAt
                    WHERE ${columns[0]} = @productId`)
   })
}

async function deleteProduct(productId) {
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productId', sql.TYPES.VarChar, productId)
         .query(`DELETE SANPHAM WHERE MaSP = @productId`)
   })
}

module.exports = {
   getProductById,
   getAllProductByCategory,
   getAllProducts,
   createProduct,
   updateProduct,
   deleteProduct,
}
