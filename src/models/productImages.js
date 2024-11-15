const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const path = require('path')
const { CreateKey, GetDate } = require('../utils/lib')

const columns = ['MAANH', 'MASP', 'ANHSP', 'NGAYTAO', 'NGAYCAPNHAT']

async function createImagesProduct(productImages = [], productId) {
   const createAt = GetDate()
   const updateAt = GetDate()
   productImages.forEach(async (productImage, index) => {
      let imageId = CreateKey('ANH_') + index
      await connectionPool.then((pool) => {
         return pool
            .request()
            .input('imageId', sql.TYPES.VarChar, imageId)
            .input('productId', sql.TYPES.VarChar, productId)
            .input('image', sql.TYPES.VarChar, productImage.filename)
            .input('createAt', sql.TYPES.DateTimeOffset, createAt)
            .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`INSERT INTO ANHSANPHAM (${columns}) VALUES (
                  @imageId, 
                  @productId, 
                  @image,
                  @createAt,
                  @updateAt)`)
      })
   })
}

async function getProductImages(productId) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('productId', sql.TYPES.VarChar, productId)
            .query('SELECT MAANH, ANHSP FROM ANHSANPHAM WHERE MASP = @productId ORDER BY MAANH')
      })

      .then((images) => images.recordset)
}

async function updateProductImages(productImages = []) {
   const updateAt = GetDate()
   productImages.forEach(
      async (image) =>
         await connectionPool.then((pool) => {
            pool
               .request()
               .input('productImageId', sql.TYPES.VarChar, image.originalname)
               .input('image', sql.TYPES.VarChar, image.filename)
               .input('updateAt', sql.TYPES.VarChar, updateAt).query(`UPDATE ANHSANPHAM SET
                  ${columns[2]} = @image,
                  ${columns[3]} = @updateAt
                  WHERE ${columns[0]} = @productImageId`)
         }),
   )
}

async function deleteProductImage(productId) {
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productId', sql.TYPES.VarChar, productId)
         .query('DELETE ANHSANPHAM WHERE MASP = @productId')
   })
}

module.exports = { createImagesProduct, getProductImages, updateProductImages, deleteProductImage }
