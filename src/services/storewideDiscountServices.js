const sql = require('mssql')
const connectionPool = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')
const columns = ['MAKMCHUNG', 'TENKM', 'ANHKM', 'GIAKM', 'NGAYBATDAU', 'NGAYKETTHUC', 'NGAYTAO', 'NGAYCAPNHAT']
async function getStorewideDiscount(storewideDiscountId) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('storewideDiscountId', sql.TYPES.VarChar, storewideDiscountId)
            .query(`SELECT * FROM KHUYENMAICHUNG WHERE MAKMCHUNG = @storewideDiscountId`)
      })
      .then((storewideDiscount) => storewideDiscount.recordset[0])
}

async function getAllStorewideDiscounts(page) {
   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      return await connectionPool
         .then((pool) => {
            return pool.request().query(`SELECT * FROM KHUYENMAICHUNG 
                        ORDER BY NgayTao
                        OFFSET ${skip} ROWS
                        FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
         })
         .then((storewideDiscounts) => storewideDiscounts.recordset)
   }
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT * FROM KHUYENMAICHUNG`)
      })
      .then((storewideDiscounts) => storewideDiscounts.recordset)
}

async function getAllStorewideDiscountsValid() {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .query(`SELECT * FROM KHUYENMAICHUNG WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC`)
      })
      .then((storewideDiscounts) => storewideDiscounts.recordset)
}

async function getAllStorewideDiscountPanelsValid() {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .query(
               `SELECT ANHKM FROM KHUYENMAICHUNG WHERE DATEADD(HOUR, 7, GETDATE()) BETWEEN NGAYBATDAU AND NGAYKETTHUC`,
            )
      })
      .then((storewideDiscounts) => storewideDiscounts.recordset)
}

async function createStorewideDiscount(posterDiscount, discountInfo) {
   const { name, price, startDate, endDate } = discountInfo
   const storewideDiscountId = CreateKey('KMC_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('storewideDiscountId', sql.TYPES.VarChar, storewideDiscountId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('DiscountPanel', sql.TYPES.VarChar, posterDiscount.filename)
         .input('price', sql.TYPES.VarChar, price)
         .input('startDate', sql.TYPES.DateTimeOffset, startDate)
         .input('endDate', sql.TYPES.DateTimeOffset, endDate)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt)
         .query(`INSERT INTO KHUYENMAICHUNG (${columns}) VALUES (
                    @storewideDiscountId,
                    @name,
                    @DiscountPanel,
                    @price,
                    @startDate,
                    @endDate,
                    @createdAt,
                    @updatedAt)`)
   })
}

module.exports = {
   getAllStorewideDiscounts,
   getStorewideDiscount,
   getAllStorewideDiscountsValid,
   getAllStorewideDiscountPanelsValid,
   createStorewideDiscount,
}
