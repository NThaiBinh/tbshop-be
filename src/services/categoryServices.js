const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')
const connectionPool = require('../config/dbConfig')

async function getCategoryById(categoryId) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('categoryId', sql.TYPES.VarChar, categoryId)
            .query(`SELECT * FROM DANHMUCSANPHAM WHERE MaDM = @categoryId`)
      })
      .then((category) => category.recordset[0])
}

async function getAllCategories() {
   return await connectionPool
      .then((pool) => {
         return pool.request().query('SELECT * FROM DANHMUCSANPHAM')
      })
      .then((categories) => categories.recordset)
}

async function createCategory(data) {
   const columns = ['MADM', 'TenDM', 'NgayTao', 'NgayCapNhat']
   const { name } = data
   const categoryId = CreateKey('DM_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('categoryId', sql.TYPES.VarChar, categoryId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt)
         .query(`INSERT INTO DANHMUCSANPHAM (${columns}) VALUES (
                    @categoryId,
                    @name,
                    @createdAt,
                    @updatedAt)`)
   })
}

async function updateCategory(data) {
   const columns = ['MADM', 'TenDM', 'NgayCapNhat']
   const { categoryId, name } = data
   const updatedAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('categoryId', sql.TYPES.VarChar, categoryId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`UPDATE DANHMUCSANPHAM SET
                    ${columns[1]} = @name,
                    ${columns[2]} = @updatedAt
                    WHERE ${columns[0]} = @categoryId`)
   })
}

async function deleteCategory(categoryId) {
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('categoryId', sql.TYPES.VarChar, categoryId)
         .query(`DELETE DANHMUCSANPHAM WHERE MaDM = @categoryId`)
   })
}

module.exports = {
   getCategoryById,
   getAllCategories,
   createCategory,
   updateCategory,
   deleteCategory,
}
