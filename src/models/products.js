const sql = require('mssql')
const connectionPool = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')
const { createImagesProduct, getProductImages, deleteProductImage, updateProductImages } = require('./productImages')
const {
   createProductConfiguration,
   getProductConfiguration,
   deleteProductConfiguration,
   updateProductConfiguration,
} = require('./productConfigurations')
const { createProductPrice, getProductPrice, deleteProductPrice } = require('./productPrices')

const columns = ['MASP', 'MADM', 'MANSX', 'MALOAISP', 'TENSP', 'SOLUONGTON', 'NGAYTAO', 'NGAYCAPNHAT']

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

async function getAllInfoProducts(page) {
   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      return await connectionPool
         .then((pool) => {
            return pool.request()
               .query(`SELECT SANPHAM.MASP, TENSP, (SELECT TOP 1 ANHSP FROM ANHSANPHAM WHERE ANHSANPHAM.MASP = SANPHAM.MASP ORDER BY MAANH ASC) AS ANHSP, 
                  (SELECT TOP 1 GIASP FROM GIASP WHERE GIASP.MASP = SANPHAM.MASP ORDER BY NGAYCAPNHATGIA DESC) AS GIASP, MACAUHINH, MANHINH, 
                  CPU, GPU, RAM, DOPHANGIAI, TANGSOQUET, DUNGLUONG, SAC, SANPHAM.NGAYTAO, SANPHAM.NGAYCAPNHAT 
                  FROM SANPHAM INNER JOIN CAUHINH ON SANPHAM.MASP = CAUHINH.MASP
                  ORDER BY NGAYTAO DESC
                  OFFSET ${skip} ROWS 
                  FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
         })
         .then((products) => products.recordset)
   }
   return await connectionPool
      .then((pool) => {
         return pool.request()
            .query(`SELECT SANPHAM.MASP, TENSP, (SELECT TOP 1 ANHSP FROM ANHSANPHAM WHERE ANHSANPHAM.MASP = SANPHAM.MASP ORDER BY MAANH ASC) AS ANHSP, 
                  (SELECT TOP 1 GIASP FROM GIASP WHERE GIASP.MASP = SANPHAM.MASP ORDER BY NGAYCAPNHATGIA DESC) AS GIASP, MACAUHINH, MANHINH, 
                  CPU, GPU, RAM, DOPHANGIAI, TANGSOQUET, DUNGLUONG, SAC, SANPHAM.NGAYTAO, SANPHAM.NGAYCAPNHAT 
                  FROM SANPHAM INNER JOIN CAUHINH ON SANPHAM.MASP = CAUHINH.MASP`)
      })
      .then((products) => products.recordset)
}

async function getProductDetails(productId, productConfigurationId) {
   const productInfo = await getProductById(productId)
   const productImages = await getProductImages(productId)
   const price = await getProductPrice(productId)
   const productConfiguration = await getProductConfiguration(productConfigurationId)
   return {
      productImages,
      productInfo: { ...productInfo, GIASP: price.GIASP },
      productConfiguration,
   }
}

async function getProductInfoWidthoutConfig(productId) {
   const productInfo = await getProductById(productId)
   const productImages = await getProductImages(productId)
   const price = await getProductPrice(productId)
   if (productInfo) {
      return {
         productImages,
         productInfo: { ...productInfo, GIASP: price.GIASP },
      }
   } else {
      return undefined
   }
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
               SELECT SANPHAM.MASP, MADM, MANSX, TENSP, MOTASP, GIASP, NGAYCAPNHAT  
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

async function createProduct({ productImages, productInfo, productConfiguration }) {
   const { categoryId, productTypeId, manufacId, name, quantity, price } = productInfo
   const productId = CreateKey('SP_')
   const createAt = GetDate()
   const updateAt = GetDate()

   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productId', sql.TYPES.VarChar, productId)
         .input('categoryId', sql.TYPES.VarChar, categoryId)
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('productTypeId', sql.TYPES.VarChar, productTypeId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('quantity', sql.TYPES.Int, quantity)
         .input('createAt', sql.TYPES.DateTimeOffset, createAt)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`INSERT INTO SANPHAM (${columns}) VALUES (
            @productId, 
            @categoryId, 
            @manufacId, 
            @productTypeId,
            @name,  
            @quantity,
            @createAt,
            @updateAt)`)
   })
   await createImagesProduct(productImages, productId)
   await createProductPrice(price, productId)
   await createProductConfiguration(productConfiguration, productId)
}

async function updateProduct(productId, productImages, productInfo, productConfigurationId, productConfiguration) {
   const { categoryId, productTypeId, manufacId, name, quantity, price } = productInfo
   const updateAt = GetDate()

   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productId', sql.TYPES.VarChar, productId)
         .input('categoryId', sql.TYPES.VarChar, categoryId)
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('productTypeId', sql.TYPES.VarChar, productTypeId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('quantity', sql.TYPES.Int, quantity)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`UPDATE SANPHAM SET 
         ${columns[1]} = @categoryId, 
         ${columns[2]} = @manufacId, 
         ${columns[3]} = @productTypeId, 
         ${columns[4]} = @name, 
         ${columns[5]} = @quantity,
         ${columns[7]} = @updateAt
         WHERE ${columns[0]} = @productId`)
   })
   await updateProductImages(productImages)
   await createProductPrice(price, productId)
   await updateProductConfiguration(productConfiguration, productConfigurationId)
}

async function deleteProduct(productId) {
   await deleteProductImage(productId)
   await deleteProductPrice(productId)
   await deleteProductConfiguration(productId)
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
   getProductDetails,
   getProductInfoWidthoutConfig,
   getAllProducts,
   getAllInfoProducts,
   createProduct,
   updateProduct,
   deleteProduct,
}
