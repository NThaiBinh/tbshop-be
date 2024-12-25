const { connectionPool } = require('../config/dbConfig')
const sql = require('mssql')

async function searchProducts(searchValue) {
   return await connectionPool
      .then((pool) => {
         return pool.request().input('searchValue', sql.TYPES.NVarChar, searchValue).query(`
            SELECT 
               SANPHAM.MASP, TENSP, MACAUHINH,
				   (SELECT TOP 1 ANHSP FROM ANHSANPHAM WHERE ANHSANPHAM.MASP = SANPHAM.MASP ORDER BY MAANH ASC) AS ANHSP, 
				   (SELECT TOP 1 GIASP FROM GIASP WHERE GIASP.MASP = SANPHAM.MASP ORDER BY GIASP.NGAYCAPNHATGIA DESC) AS GIASP
				FROM SANPHAM INNER JOIN CAUHINH ON SANPHAM.MASP = CAUHINH.MASP 
				WHERE TENSP LIKE '%${searchValue}%'
            `)
      })
      .then((searchResults) => searchResults.recordset)
}

module.exports = { searchProducts }
