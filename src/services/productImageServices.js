const { connectionPool, executeQuery } = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')

const columns = ['MAANH', 'MASP', 'ANHSP', 'NGAYTAO', 'NGAYCAPNHAT']

async function createImagesProduct(productImages = [], productId) {
   const createdAt = GetDate()
   const updatedAt = GetDate()
   // productImages.forEach(async (productImage, index) => {
   //    let imageId = CreateKey('ANH_') + index
   //    await connectionPool.then((pool) => {
   //       return pool
   //          .request()
   //          .input('imageId', sql.TYPES.VarChar, imageId)
   //          .input('productId', sql.TYPES.VarChar, productId)
   //          .input('image', sql.TYPES.VarChar, productImage.filename)
   //          .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
   //          .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO ANHSANPHAM (${columns}) VALUES (
   //                @imageId,
   //                @productId,
   //                @image,
   //                @createdAt,
   //                @updatedAt)`)
   //    })
   // })

   productImages.forEach(async (productImage, index) => {
      let imageId = CreateKey('ANH_') + index
      const params = [
         { name: 'imageId', type: sql.TYPES.VarChar, value: imageId },
         { name: 'productId', type: sql.TYPES.VarChar, value: productId },
         { name: 'image', type: sql.TYPES.VarChar, value: productImage.filename },
         { name: 'createdAt', type: sql.TYPES.DateTimeOffset, value: createdAt },
         { name: 'updatedAt', type: sql.TYPES.DateTimeOffset, value: updatedAt },
      ]
      const query = `
         INSERT INTO ANHSANPHAM (${columns}) VALUES (
            @imageId,
            @productId,
            @image,
            @createdAt,
            @updatedAt)`
      await executeQuery(query, params)
   })
}

async function getProductImages(productId) {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .input('productId', sql.TYPES.VarChar, productId)
   //          .query('SELECT MAANH, ANHSP FROM ANHSANPHAM WHERE MASP = @productId ORDER BY MAANH')
   //    })

   //    .then((images) => images.recordset)
   const params = [{ name: 'productId', type: sql.TYPES.VarChar, value: productId }]
   const query = 'SELECT MAANH, ANHSP FROM ANHSANPHAM WHERE MASP = @productId ORDER BY MAANH'
   return await executeQuery(query, params)
}

async function updateProductImages(productImages = []) {
   const updatedAt = GetDate()
   // productImages.forEach(
   //    async (image) =>
   //       await connectionPool.then((pool) => {
   //          pool
   //             .request()
   //             .input('productImageId', sql.TYPES.VarChar, image.originalname)
   //             .input('image', sql.TYPES.VarChar, image.filename)
   //             .input('updatedAt', sql.TYPES.VarChar, updatedAt).query(`UPDATE ANHSANPHAM SET
   //                ${columns[2]} = @image,
   //                ${columns[3]} = @updatedAt
   //                WHERE ${columns[0]} = @productImageId`)
   //       }),
   // )

   productImages.forEach(async (productImage) => {
      const params = [
         { name: 'productImageId', type: sql.TYPES.VarChar, value: productImage.originalname },
         { name: 'image', type: sql.TYPES.VarChar, value: productImage.filename },
         { name: 'updatedAt', type: sql.TYPES.VarChar, value: updatedAt },
      ]
      const query = `
         UPDATE ANHSANPHAM SET
            ${columns[2]} = @image,
            ${columns[3]} = @updatedAt
         WHERE 
            ${columns[0]} = @productImageId`
      await executeQuery(query, params)
   })
}

async function deleteProductImage(productId) {
   // await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('productId', sql.TYPES.VarChar, productId)
   //       .query('DELETE ANHSANPHAM WHERE MASP = @productId')
   // })

   const params = [{ name: 'productId', type: sql.TYPES.VarChar, value: productId }]
   const query = `DELETE ANHSANPHAM WHERE MASP = @productId`
   await executeQuery(query, params)
}

module.exports = { createImagesProduct, getProductImages, updateProductImages, deleteProductImage }
