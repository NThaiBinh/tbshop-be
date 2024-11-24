const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')
const connectionPool = require('../config/dbConfig')

const columns = ['MADM', 'TENDM']

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
   const { name } = data
   const categoryId = CreateKey('DM_')
   await connectionPool.then((pool) =>
      pool.request().input('categoryId', sql.TYPES.VarChar, categoryId).input('name', sql.TYPES.NVarChar, name)
         .query(`INSERT INTO DANHMUCSANPHAM (${columns}) VALUES (
                    @categoryId,
                    @name)`),
   )
}

async function updateCategory(data) {
   const { categoryId, name } = data
   await connectionPool.then((pool) => {
      return pool.request().input('categoryId', sql.TYPES.VarChar, categoryId).input('name', sql.TYPES.NVarChar, name)
         .query(`UPDATE DANHMUCSANPHAM SET
                    ${columns[1]} = @name
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
