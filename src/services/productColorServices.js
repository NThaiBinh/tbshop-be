const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey } = require('../utils/lib')
const columns = ['MAMAUSP', 'MACAUHINH', 'MAUSP', 'TENMAUSP']

async function getProductColors(productConfigurationId) {
   return await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
            .query('SELECT * FROM MAUSP WHERE MACAUHINH = @productConfigurationId'),
      )
      .then((productColors) => productColors.recordset)
}

async function createProductColor(productColors = [], productConfigurationId) {
   if (!Array.isArray(productColors)) {
      productColors = [productColors]
   }
   productColors.forEach(async (productColor, index) => {
      const productColorId = CreateKey('MAU_') + index
      const productColorInfo = JSON.parse(productColor)
      if (productColorInfo.state === 'add') {
         await connectionPool
            .then((pool) =>
               pool
                  .request()
                  .input('productColorId', sql.TYPES.VarChar, productColorId)
                  .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
                  .input('color', sql.TYPES.VarChar, productColorInfo.color)
                  .input('name', sql.TYPES.VarChar, productColorInfo.name)
                  .query(`INSERT INTO MAUSP (${columns}) VALUES (
                @productColorId,
                @productConfigurationId,
                @color,
                @name)`),
            )
            .then((productColors) => productColors.recordset)
      }
   })
}

async function deleteProductColor(productColors = []) {
   productColors.forEach(async (productColor, index) => {
      const productColorInfo = JSON.parse(productColor)
      if (productColorInfo?.state === 'delete' && `${productColorInfo.productColorId}`.includes('MAU')) {
         await connectionPool.then((pool) =>
            pool
               .request()
               .input('productColorId', sql.TYPES.VarChar, productColorInfo.productColorId)
               .query('DELETE MAUSP  WHERE MAMAUSP = @productColorId'),
         )
      }
   })
}

module.exports = { getProductColors, createProductColor, deleteProductColor }
