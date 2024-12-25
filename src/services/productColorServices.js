const { connectionPool, executeQuery } = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey } = require('../utils/lib')
const columns = ['MAMAUSP', 'MACAUHINH', 'MAUSP', 'TENMAUSP']

async function getProductColors(productConfigurationId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool
   //          .request()
   //          .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
   //          .query('SELECT * FROM MAUSP WHERE MACAUHINH = @productConfigurationId'),
   //    )
   //    .then((productColors) => productColors.recordset)
   const params = [{ name: 'productConfigurationId', type: sql.TYPES.VarChar, value: productConfigurationId }]
   const query = 'SELECT * FROM MAUSP WHERE MACAUHINH = @productConfigurationId'
   return await executeQuery(query, params)
}

async function createProductColor(productColors = [], productConfigurationId) {
   if (!Array.isArray(productColors)) {
      productColors = [productColors]
   }
   const query = `INSERT INTO MAUSP (${columns}) VALUES (@productColorId, @productConfigurationId, @color, @name)`
   productColors.forEach(async (productColor, index) => {
      const productColorId = CreateKey('MAU_') + index
      const productColorInfo = JSON.parse(productColor)
      if (productColorInfo.state === 'add') {
         const params = [
            { name: 'productColorId', type: sql.TYPES.VarChar, value: productColorId },
            { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: productConfigurationId },
            { name: 'color', type: sql.TYPES.VarChar, value: productColorInfo.color },
            { name: 'name', type: sql.TYPES.NVarChar, value: productColorInfo.name },
         ]
         await executeQuery(query, params)

         // await connectionPool
         //    .then((pool) =>
         //       pool
         //          .request()
         //          .input('productColorId', sql.TYPES.VarChar, productColorId)
         //          .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
         //          .input('color', sql.TYPES.VarChar, productColorInfo.color)
         //          .input('name', sql.TYPES.NVarChar, productColorInfo.name)
         //          .query(`INSERT INTO MAUSP (${columns}) VALUES (
         //        @productColorId,
         //        @productConfigurationId,
         //        @color,
         //        @name)`),
         //    )
         //    .then((productColors) => productColors.recordset)
      }
   })
}

async function deleteProductColor(productColors = []) {
   if (!Array.isArray(productColors)) {
      productColors = [productColors]
   }
   const query = `DELETE MAUSP  WHERE MAMAUSP = @productColorId`
   productColors.forEach(async (productColor, index) => {
      const productColorInfo = JSON.parse(productColor)
      if (productColorInfo?.state === 'delete' && `${productColorInfo.productColorId}`.includes('MAU')) {
         const params = [{ name: 'productColorId', type: sql.TYPES.VarChar, value: productColorId }]
         await executeQuery(query, params)
         // await connectionPool.then((pool) =>
         //    pool
         //       .request()
         //       .input('productColorId', sql.TYPES.VarChar, productColorInfo.productColorId)
         //       .query('DELETE MAUSP  WHERE MAMAUSP = @productColorId'),
         // )
      }
   })
}

async function deleteProductColorByProductConfigurationId(productConfigurationId) {
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
   //       .query('DELETE MAUSP  WHERE MACAUHINH = @productConfigurationId'),
   // )
   const params = [{ name: 'productConfigurationId', type: sql.TYPES.VarChar, value: productConfigurationId }]
   const query = 'DELETE MAUSP  WHERE MACAUHINH = @productConfigurationId'
   await executeQuery(query, params)
}

module.exports = {
   getProductColors,
   createProductColor,
   deleteProductColor,
   deleteProductColorByProductConfigurationId,
}
