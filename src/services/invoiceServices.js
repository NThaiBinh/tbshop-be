const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')
const { deleteCartItem } = require('./cartServices')

const columns = ['MAHD', 'MANV', 'MAKH', 'TONGTIEN', 'MUATAICUAHANG', 'TRANGTHAI', 'NGAYTAO', 'NGAYCAPNHAT']
const invoiceDetailColumns = ['MAHD', 'MASP', 'MACAUHINH', 'MAMAUSP', 'SOLUONGSP', 'GIA', 'TONGTIEN']

async function getAllInvoices() {
   return await connectionPool
      .then((pool) =>
         pool.request().query(`
            SELECT 
               KHACHHANG.MAKH, TENKH, DIACHIGIAO, 
               (SELECT 
                  CTHOADON.MAHD, CTHOADON.MASP, CTHOADON.MACAUHINH, CTHOADON.MAMAUSP, TENSP, 
                  (SELECT TOP 1  ANHSP FROM ANHSANPHAM WHERE MASP = CTHOADON.MASP ORDER BY MAANH) AS ANHSP, 
                  SOLUONGTON, DUNGLUONG, CPU, GPU, RAM, TENMAUSP, SOLUONGSP, GIA, CTHOADON.TONGTIEN, TRANGTHAI
               FROM 
                  HOADON INNER JOIN CTHOADON ON HOADON.MAHD = CTHOADON.MAHD 
                  INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP 
                  INNER JOIN CAUHINH ON CTHOADON.MACAUHINH = CAUHINH.MACAUHINH 
                  INNER JOIN MAUSP ON CTHOADON.MAMAUSP = MAUSP.MAMAUSP 
               WHERE 
                  HOADON.MAKH = KHACHHANG.MAKH AND TRANGTHAI = 'delivering' FOR JSON PATH) AS DANHSACHDONHANG
			   FROM 
               KHACHHANG INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH 
            WHERE MACDINH = 'True'`),
      )
      .then((invoices) => {
         return invoices.recordset
            .map((invoice) => {
               const invoiceList = invoice?.DANHSACHDONHANG ? JSON.parse(invoice.DANHSACHDONHANG) : []
               return {
                  customerId: invoice.MAKH,
                  name: invoice.TENKH,
                  address: invoice.DIACHIGIAO,
                  invoiceList: invoiceList,
               }
            })
            .filter((invoice) => invoice.invoiceList.length > 0)
      })
}

async function getAllInvoicesByCustomerId(customerId) {
   return await connectionPool
      .then((pool) =>
         pool.request().input('customerId', sql.TYPES.VarChar, customerId).query(`
            SELECT CTHOADON.MAHD, CTHOADON.MASP, CTHOADON.MACAUHINH, CTHOADON.MAMAUSP, TENSP, (SELECT TOP 1  ANHSP FROM ANHSANPHAM WHERE MASP = CTHOADON.MASP ORDER BY MAANH) AS ANHSP, 
               SOLUONGTON, DUNGLUONG, CPU, GPU, RAM, TENMAUSP, SOLUONGSP, GIA, CTHOADON.TONGTIEN, TRANGTHAI
               FROM HOADON INNER JOIN CTHOADON ON HOADON.MAHD = CTHOADON.MAHD 
               INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP 
               INNER JOIN CAUHINH ON CTHOADON.MACAUHINH = CAUHINH.MACAUHINH 
               INNER JOIN MAUSP ON CTHOADON.MAMAUSP = MAUSP.MAMAUSP WHERE HOADON.MAKH = @customerId`),
      )
      .then((cartItems) => cartItems.recordset)
}

async function createInvoice(invoiceInfo) {
   const { employeeId, customerId, totalOrderPrice, purchasedInStore, status, orderList } = invoiceInfo
   const invoiceId = CreateKey('HD_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   await connectionPool.then((pool) =>
      pool
         .request()
         .input('invoiceId', sql.TYPES.VarChar, invoiceId)
         .input('employeeId', sql.TYPES.VarChar, employeeId)
         .input('customerId', sql.TYPES.VarChar, customerId)
         .input('totalOrderPrice', sql.TYPES.Float, totalOrderPrice)
         .input('purchasedInStore', sql.TYPES.Bit, purchasedInStore)
         .input('status', sql.TYPES.VarChar, status)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO HOADON (${columns}) VALUES (
            @invoiceId,
            @employeeId,
            @customerId,
            @totalOrderPrice,
            @purchasedInStore,
            @status,
            @createdAt,
            @updatedAt)`),
   )
   orderList.forEach(async (ortherItem) => {
      await connectionPool.then((pool) =>
         pool
            .request()
            .input('invoiceId', sql.TYPES.VarChar, invoiceId)
            .input('productId', sql.TYPES.VarChar, ortherItem.productId)
            .input('productConfigurationId', sql.TYPES.VarChar, ortherItem.productConfigurationId)
            .input('productColorId', sql.TYPES.VarChar, ortherItem.productColorId)
            .input('quantity', sql.TYPES.Int, ortherItem.quantity)
            .input('price', sql.TYPES.Float, ortherItem.price)
            .input('totalPrice', sql.TYPES.Float, ortherItem.totalPrice).query(`INSERT INTO CTHOADON (${invoiceDetailColumns}) VALUES (
                  @invoiceId,
                  @productId,
                  @productConfigurationId,
                  @productColorId,
                  @quantity,
                  @price,
                  @totalPrice)`),
      )
      await deleteCartItem(ortherItem)
      await connectionPool.then((pool) =>
         pool
            .request()
            .input('productId', sql.TYPES.VarChar, ortherItem.productId)
            .input('quantity', sql.TYPES.Int, ortherItem.quantity)
            .query(`UPDATE SANPHAM SET SOLUONGTON = SOLUONGTON - @quantity WHERE MASP = @productId`),
      )
   })
}

async function countAllInvoiceInfo(customerId) {
   return await connectionPool
      .then((pool) =>
         pool.request().input('customerId', sql.TYPES.VarChar, customerId).query(`
         SELECT 
				(SELECT COUNT(*) FROM HOADON WHERE HOADON.MAHD = H.MAHD AND TRANGTHAI = 'delivering') AS SOSPDANGGIAO ,
				(SELECT COUNT(*) FROM HOADON WHERE HOADON.MAHD = H.MAHD AND TRANGTHAI = 'delivered') AS SOSPDAGIAO,
				(SELECT COUNT(*) FROM HOADON WHERE HOADON.MAHD = H.MAHD AND TRANGTHAI = 'canceled') AS SOSPDAHUY
				FROM HOADON H WHERE MAKH = @customerId`),
      )
      .then((customerInvoiceCnt) => customerInvoiceCnt.recordset[0])
}

async function confirmInvoice(invoiceId) {
   return await connectionPool.then((pool) =>
      pool.request().input('invoiceId', sql.TYPES.VarChar, invoiceId).query(`UPDATE HOADON SET TRANGTHAI = 'delivered' WHERE MAHD = @invoiceId`),
   )
}

module.exports = {
   getAllInvoices,
   createInvoice,
   countAllInvoiceInfo,
   getAllInvoicesByCustomerId,
   confirmInvoice,
}
