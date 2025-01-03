const sql = require('mssql')
const { connectionPool } = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')
const {
   createImagesProduct,
   getProductImages,
   deleteProductImage,
   updateProductImages,
} = require('./productImageServices')
const {
   createProductConfiguration,
   getProductConfiguration,
   deleteProductConfiguration,
   updateProductConfiguration,
} = require('./productConfigurationServices')
const { createProductPrice, getProductPrice, deleteProductPrice } = require('./productPriceServices')
const {
   createProductColor,
   getProductColors,
   deleteProductColor,
   deleteProductColorByProductConfigurationId,
} = require('./productColorServices')
const { calculateProductDiscount } = require('./productDiscountServices')

const columns = ['MASP', 'MADM', 'MANSX', 'MALOAISP', 'TENSP', 'SOLUONGTON', 'NGAYTAO', 'NGAYCAPNHAT']

async function productFilter(categoryId, manufacId, productTypeId, page) {
   const PAGE_SIZE = 20
   const skip = (parseInt(page) - 1) * PAGE_SIZE
   let query = `
      SELECT
         SANPHAM.MASP, 
         TENSP, 
         (SELECT TOP 1 ANHSP FROM ANHSANPHAM WHERE ANHSANPHAM.MASP = SANPHAM.MASP ORDER BY MAANH ASC) AS ANHSP,
         (SELECT TOP 1 GIASP FROM GIASP WHERE GIASP.MASP = SANPHAM.MASP ORDER BY NGAYCAPNHATGIA DESC) AS GIASP, 
         MACAUHINH, 
         MANHINH, 
         CPU, 
         GPU, 
         RAM,
         DOPHANGIAI, 
         TANGSOQUET, 
         DUNGLUONG, 
         SAC, 
         SANPHAM.NGAYTAO, 
         SANPHAM.NGAYCAPNHAT,
         (SELECT
            * 
         FROM 
            KHUYENMAI 
         WHERE 
            KHUYENMAI.MASP = SANPHAM.MASP 
            AND DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU 
            AND NGAYKETTHUC FOR JSON PATH) AS DANHSACHKHUYENMAI
      FROM 
         SANPHAM 
         INNER JOIN CAUHINH ON SANPHAM.MASP = CAUHINH.MASP WHERE 1 = 1 `

   if (categoryId) {
      query += ` AND MADM = @categoryId `
   }

   if (manufacId) {
      query += `AND MANSX = @manufacId `
   }

   if (productTypeId) {
      query += `AND MALOAISP = @productTypeId `
   }

   if (page) {
      query += `ORDER BY NGAYTAO DESC OFFSET ${skip} ROWS FETCH NEXT ${PAGE_SIZE} ROWS ONLY`
   }

   return await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('categoryId', sql.TYPES.VarChar, categoryId)
            .input('manufacId', sql.TYPES.VarChar, manufacId)
            .input('productTypeId', sql.TYPES.VarChar, productTypeId)
            .input('page', sql.TYPES.Int, page)
            .query(query),
      )
      .then((results) => results.recordset)
}

async function productFilterDashbroad(q) {
   if (q) {
      const searchQuery = `%${q}%`
      return await connectionPool
         .then((pool) =>
            pool.request().input('q', sql.TYPES.NVarChar, searchQuery).query(`
            SELECT 
               SANPHAM.MASP, 
               TENSP, 
               TENNSX,
               (SELECT TOP 1 ANHSP FROM ANHSANPHAM WHERE ANHSANPHAM.MASP = SANPHAM.MASP ORDER BY MAANH ASC) AS ANHSP, 
               (SELECT TOP 1 GIASP FROM GIASP WHERE GIASP.MASP = SANPHAM.MASP ORDER BY NGAYCAPNHATGIA DESC) AS GIASP, 
               SOLUONGTON, 
               MACAUHINH, 
               MANHINH, 
               CPU, 
               GPU, 
               RAM, 
               DOPHANGIAI, 
               TANGSOQUET, 
               DUNGLUONG, 
               SAC, 
               SANPHAM.NGAYTAO, 
               SANPHAM.NGAYCAPNHAT,
               (SELECT 
                  * 
               FROM 
                  KHUYENMAI 
               WHERE 
                  KHUYENMAI.MASP = SANPHAM.MASP 
                  AND DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU 
                  AND NGAYKETTHUC FOR JSON PATH) AS DANHSACHKHUYENMAI
            FROM 
               SANPHAM 
               INNER JOIN CAUHINH ON SANPHAM.MASP = CAUHINH.MASP 
               INNER JOIN NHASANXUAT ON SANPHAM.MANSX = NHASANXUAT.MANSX
            WHERE 
               TENSP LIKE @q OR TENNSX LIKE @q`),
         )
         .then((results) => results.recordset)
   } else {
      return getAllInfoProducts(1)
   }
}

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
   let query = `
      SELECT 
         SANPHAM.MASP, 
         TENSP, 
         TENNSX,
         (SELECT TOP 1 ANHSP FROM ANHSANPHAM WHERE ANHSANPHAM.MASP = SANPHAM.MASP ORDER BY MAANH ASC) AS ANHSP, 
         (SELECT TOP 1 GIASP FROM GIASP WHERE GIASP.MASP = SANPHAM.MASP ORDER BY NGAYCAPNHATGIA DESC) AS GIASP, 
         SOLUONGTON, 
         MACAUHINH, 
         MANHINH, 
         CPU, 
         GPU, 
         RAM, 
         DOPHANGIAI, 
         TANGSOQUET, 
         DUNGLUONG, 
         SAC, 
         SANPHAM.NGAYTAO, 
         SANPHAM.NGAYCAPNHAT,
         (SELECT 
            * 
         FROM 
            KHUYENMAI 
         WHERE 
            KHUYENMAI.MASP = SANPHAM.MASP 
            AND DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU 
            AND NGAYKETTHUC FOR JSON PATH) AS DANHSACHKHUYENMAI
      FROM 
         SANPHAM 
         INNER JOIN CAUHINH ON SANPHAM.MASP = CAUHINH.MASP 
         INNER JOIN NHASANXUAT ON SANPHAM.MANSX = NHASANXUAT.MANSX
      ORDER BY 
         NGAYTAO DESC`

   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      query += ` OFFSET 
                  ${skip} ROWS 
               FETCH NEXT 
                  ${PAGE_SIZE} ROWS ONLY`
   }

   return await connectionPool
      .then((pool) => {
         return pool.request().query(query)
      })
      .then((products) =>
         products.recordset.map((product) => {
            const productDiscounts = product.DANHSACHKHUYENMAI ? JSON.parse(product.DANHSACHKHUYENMAI) : []
            return {
               ...product,
               DANHSACHKHUYENMAI: productDiscounts,
               ...calculateProductDiscount(product.GIASP, productDiscounts),
            }
         }),
      )
}

async function getProductDetailsWidthDiscount(productId, productConfigurationId) {
   const productInfo = await connectionPool
      .then((pool) => {
         return pool.request().input('productId', sql.TYPES.VarChar, productId).query(`
               SELECT 
                  SANPHAM.MASP, 
                  TENSP, 
                  (SELECT TOP 1 GIASP FROM GIASP WHERE GIASP.MASP = SANPHAM.MASP ORDER BY NGAYCAPNHATGIA DESC) AS GIASP, 
                  SOLUONGTON,
                  SANPHAM.NGAYTAO, 
                  SANPHAM.NGAYCAPNHAT, 
                  (SELECT 
                     * 
                  FROM 
                     KHUYENMAI 
                  WHERE 
                     KHUYENMAI.MASP = SANPHAM.MASP 
                     AND DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU 
                     AND NGAYKETTHUC FOR JSON PATH) AS DANHSACHKHUYENMAI
               FROM 
                  SANPHAM
               WHERE 
                  MASP = @productId`)
      })
      .then((product) => {
         const productDiscounts = product.recordset[0]?.DANHSACHKHUYENMAI
            ? JSON.parse(product.recordset[0]?.DANHSACHKHUYENMAI)
            : []
         return {
            ...product.recordset[0],
            DANHSACHKHUYENMAI: productDiscounts,
            ...calculateProductDiscount(product.recordset[0]?.GIASP, productDiscounts),
         }
      })

   const productImages = await getProductImages(productId)
   const productColors = await getProductColors(productConfigurationId)
   const price = await getProductPrice(productId)
   const productConfiguration = await getProductConfiguration(productConfigurationId)
   if (price) {
      return {
         productImages,
         productInfo: { ...productInfo, GIASP: price.GIASP },
         productColors,
         productConfiguration,
      }
   } else {
      return undefined
   }
}

async function getProductDetails(productId, productConfigurationId) {
   const productInfo = await getProductById(productId)
   const productImages = await getProductImages(productId)
   const productColors = await getProductColors(productConfigurationId)
   const price = await getProductPrice(productId)
   const productConfiguration = await getProductConfiguration(productConfigurationId)
   if (price) {
      return {
         productImages,
         productInfo: { ...productInfo, GIASP: price.GIASP },
         productColors,
         productConfiguration,
      }
   } else {
      return undefined
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

async function createProduct({ productImages, productInfo, productConfiguration, productColors }) {
   const { categoryId, productTypeId, manufacId, name, quantity, price } = productInfo
   const productId = CreateKey('SP_')
   const createdAt = GetDate()
   const updatedAt = GetDate()

   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productId', sql.TYPES.VarChar, productId)
         .input('categoryId', sql.TYPES.VarChar, categoryId)
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('productTypeId', sql.TYPES.VarChar, productTypeId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('quantity', sql.TYPES.Int, quantity)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO SANPHAM (${columns}) VALUES (
            @productId,
            @categoryId,
            @manufacId,
            @productTypeId,
            @name,
            @quantity,
            @createdAt,
            @updatedAt)`)
   })

   await createImagesProduct(productImages, productId)
   await createProductPrice(price, productId)
   const productConfigurationId = await createProductConfiguration(productConfiguration, productId)
   await createProductColor(productColors, productConfigurationId)
}

async function updateProduct(
   productId,
   productImages,
   productInfo,
   productConfigurationId,
   productConfiguration,
   productColors,
) {
   const { categoryId, productTypeId, manufacId, name, quantity, price } = productInfo
   const updatedAt = GetDate()

   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productId', sql.TYPES.VarChar, productId)
         .input('categoryId', sql.TYPES.VarChar, categoryId)
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .input('productTypeId', sql.TYPES.VarChar, productTypeId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('quantity', sql.TYPES.Int, quantity)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`UPDATE SANPHAM SET 
         ${columns[1]} = @categoryId, 
         ${columns[2]} = @manufacId, 
         ${columns[3]} = @productTypeId, 
         ${columns[4]} = @name, 
         ${columns[5]} = @quantity,
         ${columns[7]} = @updatedAt
         WHERE ${columns[0]} = @productId`)
   })
   await updateProductImages(productImages)
   await createProductPrice(price, productId)
   await updateProductConfiguration(productConfiguration, productConfigurationId)
   await deleteProductColor(productColors)
   await createProductColor(productColors, productConfigurationId)
}

async function getAllConfigurations(productId) {
   return await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('productId', sql.TYPES.VarChar, productId)
            .query(`SELECT * FROM CAUHINH WHERE MASP = @productId`),
      )
      .then((productConfigurations) => productConfigurations.recordset)
}

async function deleteProduct(productId, productConfigurationId) {
   await deleteProductColorByProductConfigurationId(productConfigurationId)
   await deleteProductConfiguration(productConfigurationId)
   const productConfigurations = await getAllConfigurations(productId)
   if (!productConfigurations) {
      await deleteProductImage(productId)
      await deleteProductPrice(productId)
      await connectionPool.then((pool) => {
         return pool
            .request()
            .input('productId', sql.TYPES.VarChar, productId)
            .query(`DELETE SANPHAM WHERE MASP = @productId`)
      })
   }
}

module.exports = {
   getProductById,
   productFilter,
   getAllProductByCategory,
   getProductDetails,
   getProductDetailsWidthDiscount,
   getProductInfoWidthoutConfig,
   getAllInfoProducts,
   createProduct,
   updateProduct,
   deleteProduct,
   productFilterDashbroad,
}
