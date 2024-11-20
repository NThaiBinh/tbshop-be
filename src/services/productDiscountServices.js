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
            .query(
               `SELECT ANHKM FROM KHUYENMAICHUNG WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC`,
            )
      })
      .then((productDiscounts) => productDiscounts.recordset)
}

async function createProductDiscount(DiscountPanel, DiscountInfo) {
   const { productId, name, price, startDate, endDate } = DiscountInfo
   const productDiscountId = CreateKey('KM_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productDiscountId', sql.TYPES.VarChar, productDiscountId)
         .input('productId', sql.TYPES.VarChar, productId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('DiscountPanel', sql.TYPES.VarChar, DiscountPanel.filename)
         .input('price', sql.TYPES.VarChar, price)
         .input('startDate', sql.TYPES.DateTimeOffset, startDate)
         .input('endDate', sql.TYPES.DateTimeOffset, endDate)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO KHUYENMAI (${columns}) VALUES (
                  @productDiscountId,        
                  @productId,
                  @name,
                  @DiscountPanel,
                  @price,
                  @startDate,
                  @endDate,
                  @createdAt,
                  @updatedAt)`)
   })
}

async function deleteManufac(manufacId) {
   return connectionPool.then((pool) => {
      return pool
         .request()
         .input('manufacId', sql.TYPES.VarChar, manufacId)
         .query(`DELETE NHASANXUAT WHERE MaNSX = @manufacId`)
   })
}

module.exports = {
   getAllProductDiscounts,
   getAllProductDiscountPanelsValid,
   getAllProductDiscountsValid,
   getAllProductDiscountsValidByProductId,
   createProductDiscount,
}
