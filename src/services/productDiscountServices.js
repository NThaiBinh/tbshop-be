const sql = require('mssql')
const connectionPool = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')
const columns = ['MAKM', 'MASP', 'TENKM', 'ANHKM', 'GIAKM', 'NGAYBATDAU', 'NGAYKETTHUC', 'NGAYTAO', 'NGAYCAPNHAT']

async function getAllProductDiscounts(page) {
   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      return await connectionPool
         .then((pool) => {
            return pool.request().query(`SELECT * FROM KHUYENMAI
                        ORDER BY NgayTao
                        OFFSET ${skip} ROWS
                        FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
         })
         .then((productDiscounts) => productDiscounts.recordset)
   }
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT * FROM KHUYENMAI ORDER BY NgayTao`)
      })
      .then((productDiscounts) => productDiscounts.recordset)
}

async function getAllProductDiscountsValid() {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .query(`SELECT * FROM KHUYENMAI WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC`)
      })
      .then((productDiscounts) => productDiscounts.recordset)
}

async function getAllProductDiscountsValidByProductId(productId) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('productId', sql.TYPES.VarChar, productId)
            .query(
               `SELECT * FROM KHUYENMAI WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC AND MASP = @productId`,
            )
      })
      .then((productDiscounts) => productDiscounts.recordset)
}

async function getAllProductDiscountPanelsValid() {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .query(`SELECT ANHKM FROM KHUYENMAI WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC`)
      })
      .then((productDiscounts) => productDiscounts.recordset)
}

async function createProductDiscount(posterDiscount, discountInfo) {
   const { productId, name, price, startDate, endDate } = discountInfo
   const productDiscountId = CreateKey('KM_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productDiscountId', sql.TYPES.VarChar, productDiscountId)
         .input('productId', sql.TYPES.VarChar, productId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('posterDiscount', sql.TYPES.VarChar, posterDiscount.filename)
         .input('price', sql.TYPES.VarChar, price)
         .input('startDate', sql.TYPES.DateTimeOffset, startDate)
         .input('endDate', sql.TYPES.DateTimeOffset, endDate)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO KHUYENMAI (${columns}) VALUES (
                  @productDiscountId,        
                  @productId,
                  @name,
                  @posterDiscount,
                  @price,
                  @startDate,
                  @endDate,
                  @createdAt,
                  @updatedAt)`)
   })
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
