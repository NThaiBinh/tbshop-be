const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')
const { deleteCartItem } = require('./cartServices')

const columns = ['MAHD', 'MANV', 'MAKH', 'TONGTIEN', 'MUATAICUAHANG', 'TRANGTHAI', 'NGAYTAO', 'NGAYCAPNHAT']
const invoiceDetailColumns = ['MAHD', 'MASP', 'MACAUHINH', 'MAMAUSP', 'SOLUONGSP', 'GIA', 'TONGTIEN']
const orderDiscountColumns = ['MAHD', 'MASP', 'MACAUHINH', 'MAMAUSP', 'MAKM']

async function getAllInvoices(status) {
   let query = `SELECT 
                  HOADON.MAHD, HOADON.MAKH, TENKH, DIACHIGIAO, 
               (SELECT 
                  CTHOADON.MAHD, CTHOADON.MASP, CTHOADON.MACAUHINH, CTHOADON.MAMAUSP, TENSP, TENMAUSP, SOLUONGSP, SOLUONGTON, CPU, GPU, RAM, GIA, TONGTIEN ,
                  (SELECT TOP 1 ANHSP FROM ANHSANPHAM WHERE MASP = CTHOADON.MASP ORDER BY MAANH ASC) AS ANHSP
               FROM 
                  CTHOADON INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP INNER JOIN MAUSP ON CTHOADON.MAMAUSP = MAUSP.MAMAUSP INNER JOIN CAUHINH ON CTHOADON.MACAUHINH = CAUHINH.MACAUHINH 
               WHERE 
                  CTHOADON.MAHD = HOADON.MAHD FOR JSON PATH) AS DANHSACHSANPHAM 
            FROM 
               HOADON INNER JOIN KHACHHANG ON HOADON.MAKH = KHACHHANG.MAKH INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH 
            WHERE 
               MACDINH = 'True'`
   if (status) {
      query += ` AND TRANGTHAI = @status`
   }
   return await connectionPool
      .then((pool) => pool.request().input('status', sql.TYPES.VarChar, status).query(query))
      .then((invoices) => {
         return invoices.recordset
            .map((invoice) => {
               const invoiceList = invoice?.DANHSACHSANPHAM ? JSON.parse(invoice.DANHSACHSANPHAM) : []
               return {
                  invoiceId: invoice.MAHD,
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
   orderList.forEach(async (orderItem) => {
      await connectionPool.then((pool) =>
         pool
            .request()
            .input('invoiceId', sql.TYPES.VarChar, invoiceId)
            .input('productId', sql.TYPES.VarChar, orderItem.productId)
            .input('productConfigurationId', sql.TYPES.VarChar, orderItem.productConfigurationId)
            .input('productColorId', sql.TYPES.VarChar, orderItem.productColorId)
            .input('quantity', sql.TYPES.Int, orderItem.quantity)
            .input('price', sql.TYPES.Float, orderItem.price)
            .input('totalPrice', sql.TYPES.Float, orderItem.totalPrice)
            .query(`INSERT INTO CTHOADON (${invoiceDetailColumns}) VALUES (
                  @invoiceId,
                  @productId,
                  @productConfigurationId,
                  @productColorId,
                  @quantity,
                  @price,
                  @totalPrice)`),
      )
      orderItem.discountList?.forEach(
         async (discountItem) =>
            await connectionPool.then((pool) =>
               pool
                  .request()
                  .input('invoiceId', sql.TYPES.VarChar, invoiceId)
                  .input('productId', sql.TYPES.VarChar, orderItem.productId)
                  .input('productConfigurationId', sql.TYPES.VarChar, orderItem.productConfigurationId)
                  .input('productColorId', sql.TYPES.VarChar, orderItem.productColorId)
                  .input('discountId', sql.TYPES.VarChar, discountItem.discountId)
                  .query(`INSERT INTO HD_CO_KHUYEN_MAI (${orderDiscountColumns}) VALUES (
                     @invoiceId,
                     @productId,
                     @productCOnfigurationId,
                     @productColorId,
                     @discountId)`),
            ),
      )
      await deleteCartItem(orderItem)
      await connectionPool.then((pool) =>
         pool
            .request()
            .input('productId', sql.TYPES.VarChar, orderItem.productId)
            .input('quantity', sql.TYPES.Int, orderItem.quantity)
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
      pool
         .request()
         .input('invoiceId', sql.TYPES.VarChar, invoiceId)
         .query(`UPDATE HOADON SET TRANGTHAI = 'delivered' WHERE MAHD = @invoiceId`),
   )
}

async function printInvoice(invoiceId) {
   return await connectionPool
      .then((pool) =>
         pool.request().input('invoiceId', sql.TYPES.VarChar, invoiceId).query(`
            SELECT 
               MAHD, TENKH, DIACHIGIAO, SDTKH, TENNV, TONGTIEN, HOADON.NGAYTAO, TRANGTHAI,
               (SELECT TENSP, GIA, SOLUONGSP, TONGTIEN FROM CTHOADON INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP WHERE CTHOADON.MAHD = HOADON.MAHD FOR JSON PATH) AS DANHSACHSANPHAM
            FROM 
               HOADON INNER JOIN KHACHHANG ON HOADON.MAKH = KHACHHANG.MAKH INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH
               INNER JOIN NHANVIEN ON HOADON.MANV = NHANVIEN.MANV 
            WHERE 
               MACDINH = 'True' AND MAHD = @invoiceId`),
      )
      .then((invoiceInfo) => {
         const productList = invoiceInfo.recordset[0]?.DANHSACHSANPHAM
            ? JSON.parse(invoiceInfo.recordset[0]?.DANHSACHSANPHAM)
            : []
         return {
            ...invoiceInfo.recordset[0],
            DANHSACHSANPHAM: productList,
         }
      })
}

async function statistical(startDate, endDate) {
   const bestProduct = await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('startDate', sql.TYPES.DateTimeOffset, startDate)
            .input('endDate', sql.TYPES.DateTimeOffset, endDate).query(`
            SELECT TOP 1 TENSP, SUM(SOLUONGSP) AS SLBAN 
            FROM CTHOADON INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP INNER JOIN HOADON ON CTHOADON.MAHD = HOADON.MAHD 
            WHERE HOADON.NGAYTAO BETWEEN @startDate and @endDate GROUP BY TENSP ORDER BY SLBAN ASC`),
      )
      .then((bestProduct) => bestProduct.recordset[0])

   const lastProduct = await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('startDate', sql.TYPES.DateTimeOffset, startDate)
            .input('endDate', sql.TYPES.DateTimeOffset, endDate).query(`
            SELECT TOP 1 TENSP, SUM(SOLUONGSP) AS SLBAN 
            FROM CTHOADON INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP INNER JOIN HOADON ON CTHOADON.MAHD = HOADON.MAHD 
            WHERE HOADON.NGAYTAO BETWEEN @startDate and @endDate GROUP BY TENSP ORDER BY SLBAN DESC`),
      )
      .then((bestProduct) => bestProduct.recordset[0])

   const totalPrice = await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('startDate', sql.TYPES.DateTimeOffset, startDate)
            .input('endDate', sql.TYPES.DateTimeOffset, endDate).query(`
            SELECT SUM(SOLUONGSP) AS TONGSODABAN, SUM(HOADON.TONGTIEN) AS TONGDOANHTHU
            FROM CTHOADON INNER JOIN HOADON ON CTHOADON.MAHD = HOADON.MAHD WHERE HOADON.NGAYTAO BETWEEN @startDate AND @endDate`),
      )
      .then((totalPrice) => totalPrice.recordset[0])

   return {
      bestProduct,
      lastProduct,
      totalPrice,
   }
}

module.exports = {
   getAllInvoices,
   createInvoice,
   countAllInvoiceInfo,
   getAllInvoicesByCustomerId,
   confirmInvoice,
   printInvoice,
   statistical,
}
