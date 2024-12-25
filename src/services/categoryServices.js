const sql = require('mssql')
const { connectionPool, executeQuery } = require('../config/dbConfig')

const columns = ['MADM', 'TENDM']

async function getCategoryById(categoryId) {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .input('categoryId', sql.TYPES.VarChar, categoryId)
   //          .query(`SELECT * FROM DANHMUCSANPHAM WHERE MaDM = @categoryId`)
   //    })
   //    .then((category) => category.recordset[0])
   const params = [{ name: 'categoryId', type: sql.TYPES.VarChar, value: categoryId }]
   const query = `SELECT * FROM DANHMUCSANPHAM WHERE MaDM = @categoryId`
   const results = await executeQuery(query, params)
   return results[0]
}

async function getAllCategories() {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool.request().query('SELECT * FROM DANHMUCSANPHAM')
   //    })
   //    .then((categories) => categories.recordset)
   const params = []
   const query = 'SELECT * FROM DANHMUCSANPHAM'
   return await executeQuery(query, params)
}

async function createCategory() {
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .query(`INSERT INTO DANHMUCSANPHAM (${columns}) VALUES ('phone', N'Điện thoại'), ('laptop', N'Laptop')`),
   // )
   const params = []
   const query = `
      INSERT INTO 
         DANHMUCSANPHAM (${columns}) 
      VALUES 
         ('phone', N'Điện thoại'), 
         ('laptop', N'Laptop')`
   await executeQuery(query, params)
}

async function updateCategory(data) {
   const { categoryId, name } = data
   // await connectionPool.then((pool) => {
   //    return pool.request().input('categoryId', sql.TYPES.VarChar, categoryId).input('name', sql.TYPES.NVarChar, name)
   //       .query(`UPDATE DANHMUCSANPHAM SET
   //                  ${columns[1]} = @name
   //                  WHERE ${columns[0]} = @categoryId`)
   // })
   const params = [
      { name: 'categoryId', type: sql.TYPES.VarChar, value: categoryId },
      { name: 'name', type: sql.TYPES.NVarChar, value: name },
   ]
   const query = `UPDATE DANHMUCSANPHAM SET ${columns[1]} = @name WHERE ${columns[0]} = @categoryId`
   await executeQuery(query, params)
}

async function deleteCategory(categoryId) {
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('categoryId', sql.TYPES.VarChar, categoryId)
   //       .query(`DELETE DANHMUCSANPHAM WHERE MaDM = @categoryId`)
   // })
   const params = [{ name: 'categoryId', type: sql.TYPES.VarChar, categoryId }]
   const query = `DELETE DANHMUCSANPHAM WHERE MaDM = @categoryId`
   await executeQuery(query, params)
}

module.exports = {
   getCategoryById,
   getAllCategories,
   createCategory,
   updateCategory,
   deleteCategory,
}
