const sql = require('mssql')
const { connectionPool, executeQuery } = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')
const columns = ['MAKM', 'MASP', 'TENKM', 'ANHKM', 'GIAKM', 'NGAYBATDAU', 'NGAYKETTHUC', 'NGAYTAO', 'NGAYCAPNHAT']

async function getAllProductDiscounts(page) {
   // if (page) {
   //    const PAGE_SIZE = 10
   //    const skip = (parseInt(page) - 1) * PAGE_SIZE
   //    return await connectionPool
   //       .then((pool) => {
   //          return pool.request().query(`
   //             SELECT
   //                MAKM,
   //                KHUYENMAI.MASP,
   //                TENSP,
   //                TENKM,
   //                ANHKM,
   //                GIAKM,
   //                NGAYBATDAU,
   //                NGAYKETTHUC,
   //                KHUYENMAI.NGAYTAO,
   //                KHUYENMAI.NGAYCAPNHAT
   //             FROM
   //                KHUYENMAI
   //                INNER JOIN SANPHAM ON KHUYENMAI.MASP = SANPHAM.MASP
   //             ORDER BY KHUYENMAI.NGAYTAO
   //             OFFSET ${skip} ROWS
   //             FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
   //       })
   //       .then((productDiscounts) => productDiscounts.recordset)
   // }
   // return await connectionPool
   //    .then((pool) => {
   //       return pool.request().query(`SELECT * FROM KHUYENMAI ORDER BY NgayTao`)
   //    })
   //    .then((productDiscounts) => productDiscounts.recordset)

   const params = []
   let query = `
      SELECT
         MAKM,
         KHUYENMAI.MASP,
         TENSP,
         TENKM,
         ANHKM,
         GIAKM,
         NGAYBATDAU,
         NGAYKETTHUC,
         KHUYENMAI.NGAYTAO,
         KHUYENMAI.NGAYCAPNHAT
      FROM
         KHUYENMAI
         INNER JOIN SANPHAM ON KHUYENMAI.MASP = SANPHAM.MASP
      ORDER BY KHUYENMAI.NGAYTAO`

   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      params.push(
         { name: 'skip', type: sql.TYPES.Int, value: skip },
         { name: 'page_size', type: sql.TYPES.Int, value: PAGE_SIZE },
      )
      query += ' OFFSET @skip ROWS FETCH NEXT @page_size ROWS ONLY'
   }

   return await executeQuery(query, params)
}

async function getAllProductDiscountsValid() {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .query(`SELECT * FROM KHUYENMAI WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC`)
   //    })
   //    .then((productDiscounts) => productDiscounts.recordset)

   const params = []
   const query = `SELECT * FROM KHUYENMAI WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC`
   return await executeQuery(query, params)
}

async function getAllProductDiscountsValidByProductId(productId) {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .input('productId', sql.TYPES.VarChar, productId)
   //          .query(
   //             `SELECT * FROM KHUYENMAI WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC AND MASP = @productId`,
   //          )
   //    })
   //    .then((productDiscounts) => productDiscounts.recordset)
   const params = [{ name: 'productId', type: sql.TYPES.VarChar, value: productId }]
   const query = `SELECT * FROM KHUYENMAI WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC AND MASP = @productId`
   return await executeQuery(query, params)
}

async function getAllProductDiscountPanelsValid() {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .query(`SELECT ANHKM FROM KHUYENMAI WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC`)
   //    })
   //    .then((productDiscounts) => productDiscounts.recordset)
   const params = []
   const query = `SELECT ANHKM FROM KHUYENMAI WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC`
   return await executeQuery(query, params)
}

async function createProductDiscount(posterDiscount, discountInfo) {
   const { productId, name, price, startDate, endDate } = discountInfo
   const productDiscountId = CreateKey('KM_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   // return await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('productDiscountId', sql.TYPES.VarChar, productDiscountId)
   //       .input('productId', sql.TYPES.VarChar, productId)
   //       .input('name', sql.TYPES.NVarChar, name)
   //       .input('posterDiscount', sql.TYPES.VarChar, posterDiscount.filename)
   //       .input('price', sql.TYPES.VarChar, price)
   //       .input('startDate', sql.TYPES.DateTimeOffset, startDate)
   //       .input('endDate', sql.TYPES.DateTimeOffset, endDate)
   //       .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
   //       .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO KHUYENMAI (${columns}) VALUES (
   //                @productDiscountId,
   //                @productId,
   //                @name,
   //                @posterDiscount,
   //                @price,
   //                @startDate,
   //                @endDate,
   //                @createdAt,
   //                @updatedAt)`)
   // })

   const params = [
      { name: 'productDiscountId', type: sql.TYPES.VarChar, value: productDiscountId },
      { name: 'productId', type: sql.TYPES.VarChar, value: productId },
      { name: 'name', type: sql.TYPES.NVarChar, value: name },
      { name: 'posterDiscount', type: sql.TYPES.VarChar, value: posterDiscount.filename },
      { name: 'price', type: sql.TYPES.Float, value: price },
      { name: 'startDate', type: sql.TYPES.DateTimeOffset, value: startDate },
      { name: 'endDate', type: sql.TYPES.DateTimeOffset, value: endDate },
      { name: 'createdAt', type: sql.TYPES.DateTimeOffset, value: createdAt },
      { name: 'updatedAt', type: sql.TYPES.DateTimeOffset, value: updatedAt },
   ]
   const query = `
      INSERT INTO KHUYENMAI (${columns}) VALUES (
         @productDiscountId,
         @productId,
         @name,
         @posterDiscount,
         @price,
         @startDate,
         @endDate,
         @createdAt,
         @updatedAt)`
   await executeQuery(query, params)
}

function calculateProductDiscount(productPrice, discounts = []) {
   let discountPrice = productPrice
   discounts.forEach((discount) => {
      if (`${discount.GIAKM}`.includes('%')) {
         discountPrice =
            discountPrice -
            (discountPrice * parseFloat(`${discount.GIAKM}`.slice(0, `${discount.GIAKM}`.length - 1))) / 100
      } else {
         discountPrice -= parseFloat(discount.GIAKM)
      }
   })
   let discountPercentage = Math.round(100 - discountPrice / (productPrice / 100))
   return {
      GIAKM: discountPrice === productPrice ? null : discountPrice,
      PHANTRAMGIAM: discountPercentage === 0 ? null : discountPercentage,
   }
}

module.exports = {
   getAllProductDiscounts,
   getAllProductDiscountPanelsValid,
   getAllProductDiscountsValid,
   getAllProductDiscountsValidByProductId,
   createProductDiscount,
   calculateProductDiscount,
}
