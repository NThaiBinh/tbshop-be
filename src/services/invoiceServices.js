const { connectionPool, executeQuery } = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')
const { deleteCartItem } = require('./cartServices')

const columns = ['MAHD', 'MANV', 'MAKH', 'TONGTIEN', 'MUATAICUAHANG', 'TRANGTHAI', 'NGAYTAO', 'NGAYCAPNHAT']
const invoiceDetailColumns = ['MAHD', 'MASP', 'MACAUHINH', 'MAMAUSP', 'SOLUONGSP', 'GIA', 'TONGTIEN']
const orderDiscountColumns = ['MAHD', 'MASP', 'MACAUHINH', 'MAMAUSP', 'MAKM']

async function getAllInvoices(status) {
   let query = `
      SELECT 
         HOADON.MAHD, 
         HOADON.MAKH, 
         TENKH, 
         DIACHIGIAO, 
         (SELECT 
            CTHOADON.MAHD, 
            CTHOADON.MASP, 
            CTHOADON.MACAUHINH, 
            CTHOADON.MAMAUSP, 
            TENSP, 
            TENMAUSP, 
            SOLUONGSP, 
            SOLUONGTON, 
            CPU, 
            GPU, 
            RAM, 
            GIA, 
            TONGTIEN ,
            (SELECT 
               TOP 1 ANHSP 
            FROM 
               ANHSANPHAM 
            WHERE 
               MASP = CTHOADON.MASP ORDER BY MAANH ASC) AS ANHSP
         FROM 
            CTHOADON 
            INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP 
            INNER JOIN MAUSP ON CTHOADON.MAMAUSP = MAUSP.MAMAUSP 
            INNER JOIN CAUHINH ON CTHOADON.MACAUHINH = CAUHINH.MACAUHINH 
         WHERE 
            CTHOADON.MAHD = HOADON.MAHD FOR JSON PATH) AS DANHSACHSANPHAM 
      FROM 
         HOADON 
         INNER JOIN KHACHHANG ON HOADON.MAKH = KHACHHANG.MAKH 
         INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH 
      WHERE 
         MACDINH = 'True'`
   if (status) {
      query += ` AND TRANGTHAI = @status`
   }
   const params = [{ name: 'status', type: sql.TYPES.VarChar, value: status }]
   const results = await executeQuery(query, params)
   return results
      .map((invoice) => {
         const invoiceList = invoice?.DANHSACHSANPHAM ? JSON.parse(invoice.DANHSACHSANPHAM) : []
         return {
            MAHD: invoice.MAHD,
            MAKH: invoice.MAKH,
            TENKH: invoice.TENKH,
            DIACHIKH: invoice.DIACHIGIAO,
            DANHSACHDONHANG: invoiceList,
         }
      })
      .filter((invoice) => invoice.DANHSACHDONHANG.length > 0)
   // return await connectionPool
   //    .then((pool) => pool.request().input('status', sql.TYPES.VarChar, status).query(query))
   //    .then((invoices) => {
   //       return invoices.recordset
   //          .map((invoice) => {
   //             const invoiceList = invoice?.DANHSACHSANPHAM ? JSON.parse(invoice.DANHSACHSANPHAM) : []
   //             return {
   //                MAHD: invoice.MAHD,
   //                MAKH: invoice.MAKH,
   //                TENKH: invoice.TENKH,
   //                DIACHIKH: invoice.DIACHIGIAO,
   //                DANHSACHDONHANG: invoiceList,
   //             }
   //          })
   //          .filter((invoice) => invoice.DANHSACHDONHANG.length > 0)
   //    })
}

async function getSearchResults(q) {
   // const query = `%${q}%`

   // if (q) {
   //    return await connectionPool.then((pool) =>
   //       pool
   //          .request()
   //          .input('query', sql.TYPES.NVarChar, query)
   //          .query(
   //             `
   //             SELECT
   //                KHACHHANG.MAKH,
   //                TENKH,
   //                DIACHIGIAO,
   //                (SELECT
   //                   CTGIOHANG.MAGIOHANG,
   //                   CTGIOHANG.MASP,
   //                   CTGIOHANG.MACAUHINH,
   //                   CTGIOHANG.MAMAUSP,
   //                   TENSP,
   //                   (SELECT
   //                      TOP 1 ANHSP
   //                   FROM
   //                      ANHSANPHAM
   //                   WHERE
   //                      MASP = CTGIOHANG.MASP ORDER BY MAANH) AS ANHSP,
   //                   SOLUONGTON,
   //                   DUNGLUONG,
   //                   CPU,
   //                   GPU,
   //                   RAM,
   //                   TENMAUSP,
   //                   SOLUONGSP,
   //                   GIA,
   //                   TONGTIEN,
   //                   TRANGTHAI
   //                FROM
   //                   GIOHANG
   //                   INNER JOIN CTGIOHANG ON GIOHANG.MAGIOHANG = CTGIOHANG.MAGIOHANG
   //                   INNER JOIN SANPHAM ON CTGIOHANG.MASP = SANPHAM.MASP
   //                   INNER JOIN CAUHINH ON CTGIOHANG.MACAUHINH = CAUHINH.MACAUHINH
   //                   INNER JOIN MAUSP ON CTGIOHANG.MAMAUSP = MAUSP.MAMAUSP
   //                WHERE
   //                   GIOHANG.MAKH = KHACHHANG.MAKH AND TRANGTHAI = 'pending' FOR JSON PATH) AS DANHSACHDONHANG
   //             FROM
   //                KHACHHANG
   //                INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH
   //             WHERE
   //                MACDINH = 'True' AND TENKH LIKE @query`,
   //          )
   //          .then((searchResults) => {
   //             return searchResults.recordset
   //                .map((searchResult) => {
   //                   const orderList = searchResult?.DANHSACHDONHANG ? JSON.parse(searchResult.DANHSACHDONHANG) : []
   //                   return {
   //                      MAKH: searchResult.MAKH,
   //                      TENKH: searchResult.TENKH,
   //                      DIACHIGIAO: searchResult.DIACHIGIAO,
   //                      DANHSACHSANPHAM: orderList,
   //                   }
   //                })
   //                .filter((searchResult) => searchResult.DANHSACHSANPHAM.length > 0)
   //          }),
   //    )
   // } else {
   //    return await getAllOrders()
   // }
   if (q) {
      const queryParams = `%${q}%`
      const params = [{ name: 'query', type: sql.TYPES.NVarChar, value: queryParams }]
      const query = `
         SELECT
            KHACHHANG.MAKH,
            TENKH,
            DIACHIGIAO,
            (SELECT
               CTGIOHANG.MAGIOHANG,
               CTGIOHANG.MASP,
               CTGIOHANG.MACAUHINH,
               CTGIOHANG.MAMAUSP,
               TENSP,
               (SELECT
                  TOP 1 ANHSP
               FROM
                  ANHSANPHAM
               WHERE
                  MASP = CTGIOHANG.MASP ORDER BY MAANH) AS ANHSP,
               SOLUONGTON,
               DUNGLUONG,
               CPU,
               GPU,
               RAM,
               TENMAUSP,
               SOLUONGSP,
               GIA,
               TONGTIEN,
               TRANGTHAI
            FROM
               GIOHANG
               INNER JOIN CTGIOHANG ON GIOHANG.MAGIOHANG = CTGIOHANG.MAGIOHANG
               INNER JOIN SANPHAM ON CTGIOHANG.MASP = SANPHAM.MASP
               INNER JOIN CAUHINH ON CTGIOHANG.MACAUHINH = CAUHINH.MACAUHINH
               INNER JOIN MAUSP ON CTGIOHANG.MAMAUSP = MAUSP.MAMAUSP
            WHERE
               GIOHANG.MAKH = KHACHHANG.MAKH AND TRANGTHAI = 'pending' FOR JSON PATH) AS DANHSACHDONHANG
         FROM
            KHACHHANG
            INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH
         WHERE
            MACDINH = 'True' AND TENKH LIKE @query`
      const results = await executeQuery(query, params)
      return results
         .map((searchResult) => {
            const orderList = searchResult?.DANHSACHDONHANG ? JSON.parse(searchResult.DANHSACHDONHANG) : []
            return {
               MAKH: searchResult.MAKH,
               TENKH: searchResult.TENKH,
               DIACHIGIAO: searchResult.DIACHIGIAO,
               DANHSACHSANPHAM: orderList,
            }
         })
         .filter((searchResult) => searchResult.DANHSACHSANPHAM.length > 0)
   } else {
      return await getAllInvoices()
   }
}

async function getAllInvoicesByCustomerId(customerId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool.request().input('customerId', sql.TYPES.VarChar, customerId).query(`
   //          SELECT
   //             CTHOADON.MAHD,
   //             CTHOADON.MASP,
   //             CTHOADON.MACAUHINH,
   //             CTHOADON.MAMAUSP,
   //             TENSP,
   //             (SELECT
   //                TOP 1  ANHSP
   //             FROM
   //                ANHSANPHAM
   //             WHERE
   //                MASP = CTHOADON.MASP ORDER BY MAANH) AS ANHSP,
   //             SOLUONGTON,
   //             DUNGLUONG,
   //             CPU,
   //             GPU,
   //             RAM,
   //             TENMAUSP,
   //             SOLUONGSP,
   //             GIA,
   //             CTHOADON.TONGTIEN,
   //             TRANGTHAI
   //          FROM
   //             HOADON
   //             INNER JOIN CTHOADON ON HOADON.MAHD = CTHOADON.MAHD
   //             INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP
   //             INNER JOIN CAUHINH ON CTHOADON.MACAUHINH = CAUHINH.MACAUHINH
   //             INNER JOIN MAUSP ON CTHOADON.MAMAUSP = MAUSP.MAMAUSP
   //          WHERE
   //             HOADON.MAKH = @customerId`),
   //    )
   //    .then((invoices) => invoices.recordset)
   const params = [{ name: 'customerId', type: sql.TYPES.VarChar, value: customerId }]
   const query = `
      SELECT
         CTHOADON.MAHD,
         CTHOADON.MASP,
         CTHOADON.MACAUHINH,
         CTHOADON.MAMAUSP,
         TENSP,
         (SELECT
            TOP 1  ANHSP
         FROM
            ANHSANPHAM
         WHERE
            MASP = CTHOADON.MASP ORDER BY MAANH) AS ANHSP,
         SOLUONGTON,
         DUNGLUONG,
         CPU,
         GPU,
         RAM,
         TENMAUSP,
         SOLUONGSP,
         GIA,
         CTHOADON.TONGTIEN,
         TRANGTHAI
      FROM
         HOADON
         INNER JOIN CTHOADON ON HOADON.MAHD = CTHOADON.MAHD
         INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP
         INNER JOIN CAUHINH ON CTHOADON.MACAUHINH = CAUHINH.MACAUHINH
         INNER JOIN MAUSP ON CTHOADON.MAMAUSP = MAUSP.MAMAUSP
      WHERE
         HOADON.MAKH = @customerId`
   return await executeQuery(query, params)
}

async function createInvoice(invoiceInfo) {
   const { employeeId, customerId, totalOrderPrice, purchasedInStore, status, orderList } = invoiceInfo
   const invoiceId = CreateKey('HD_')
   const createdAt = GetDate()
   const updatedAt = GetDate()

   //Tao hoa don
   const invoiceParams = [
      { name: 'invoiceId', type: sql.TYPES.VarChar, value: invoiceId },
      { name: 'employeeId', type: sql.TYPES.VarChar, value: employeeId },
      { name: 'customerId', type: sql.TYPES.VarChar, value: customerId },
      { name: 'totalOrderPrice', type: sql.TYPES.Float, value: totalOrderPrice },
      { name: 'purchasedInStore', type: sql.TYPES.Bit, value: purchasedInStore },
      { name: 'status', type: sql.TYPES.VarChar, value: status },
      { name: 'createdAt', type: sql.TYPES.DateTimeOffset, value: createdAt },
      { name: 'updatedAt', type: sql.TYPES.DateTimeOffset, value: updatedAt },
   ]
   const invoiceQuery = `
      INSERT INTO HOADON (${columns}) VALUES (
         @invoiceId,
         @employeeId,
         @customerId,
         @totalOrderPrice,
         @purchasedInStore,
         @status,
         @createdAt,
         @updatedAt)`
   await executeQuery(invoiceQuery, invoiceParams)
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('invoiceId', sql.TYPES.VarChar, invoiceId)
   //       .input('employeeId', sql.TYPES.VarChar, employeeId)
   //       .input('customerId', sql.TYPES.VarChar, customerId)
   //       .input('totalOrderPrice', sql.TYPES.Float, totalOrderPrice)
   //       .input('purchasedInStore', sql.TYPES.Bit, purchasedInStore)
   //       .input('status', sql.TYPES.VarChar, status)
   //       .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
   //       .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO HOADON (${columns}) VALUES (
   //          @invoiceId,
   //          @employeeId,
   //          @customerId,
   //          @totalOrderPrice,
   //          @purchasedInStore,
   //          @status,
   //          @createdAt,
   //          @updatedAt)`),
   // )
   orderList.forEach(async (orderItem) => {
      //Tao CT hoa don
      const invoiceParams = [
         { name: 'invoiceId', type: sql.TYPES.VarChar, value: invoiceId },
         { name: 'productId', type: sql.TYPES.VarChar, value: orderItem.productId },
         { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: orderItem.productConfigurationId },
         { name: 'productColorId', type: sql.TYPES.VarChar, value: orderItem.productColorId },
         { name: 'quantity', type: sql.TYPES.Int, value: orderItem.quantity },
         { name: 'price', type: sql.TYPES.Float, value: orderItem.price },
         { name: 'totalPrice', type: sql.TYPES.Float, value: orderItem.totalPrice },
      ]
      const invoiceQuery = `
         INSERT INTO CTHOADON (${invoiceDetailColumns}) VALUES (
            @invoiceId,
            @productId,
            @productConfigurationId,
            @productColorId,
            @quantity,
            @price,
            @totalPrice)`
      await executeQuery(invoiceQuery, invoiceParams)
      // await connectionPool.then((pool) =>
      //    pool
      //       .request()
      //       .input('invoiceId', sql.TYPES.VarChar, invoiceId)
      //       .input('productId', sql.TYPES.VarChar, orderItem.productId)
      //       .input('productConfigurationId', sql.TYPES.VarChar, orderItem.productConfigurationId)
      //       .input('productColorId', sql.TYPES.VarChar, orderItem.productColorId)
      //       .input('quantity', sql.TYPES.Int, orderItem.quantity)
      //       .input('price', sql.TYPES.Float, orderItem.price)
      //       .input('totalPrice', sql.TYPES.Float, orderItem.totalPrice)
      //       .query(`INSERT INTO CTHOADON (${invoiceDetailColumns}) VALUES (
      //             @invoiceId,
      //             @productId,
      //             @productConfigurationId,
      //             @productColorId,
      //             @quantity,
      //             @price,
      //             @totalPrice)`),
      // )

      //Luu khuyen mai theo san pham
      orderItem.discountList?.forEach(async (discountItem) => {
         const discountParams = [
            { name: 'invoiceId', type: sql.TYPES.VarChar, value: invoiceId },
            { name: 'productId', type: sql.TYPES.VarChar, value: orderItem.productId },
            { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: orderItem.productConfigurationId },
            { name: 'productColorId', type: sql.TYPES.VarChar, value: orderItem.productColorId },
            { name: 'discountId', type: sql.TYPES.VarChar, value: discountItem.discountId },
         ]
         const discountQuery = `
            INSERT INTO HD_CO_KHUYEN_MAI (${orderDiscountColumns}) VALUES (
               @invoiceId,
               @productId,
               @productCOnfigurationId,
               @productColorId,
               @discountId)`
         await executeQuery(discountQuery, discountParams)
         // await connectionPool.then((pool) =>
         //    pool
         //       .request()
         //       .input('invoiceId', sql.TYPES.VarChar, invoiceId)
         //       .input('productId', sql.TYPES.VarChar, orderItem.productId)
         //       .input('productConfigurationId', sql.TYPES.VarChar, orderItem.productConfigurationId)
         //       .input('productColorId', sql.TYPES.VarChar, orderItem.productColorId)
         //       .input('discountId', sql.TYPES.VarChar, discountItem.discountId)
         //       .query(`INSERT INTO HD_CO_KHUYEN_MAI (${orderDiscountColumns}) VALUES (
         //          @invoiceId,
         //          @productId,
         //          @productCOnfigurationId,
         //          @productColorId,
         //          @discountId)`),
         // ),
      })
      await deleteCartItem(orderItem)

      //Cap nhat so luong ton
      const updateQuantityParams = [
         { name: 'productId', type: sql.TYPES.VarChar, value: orderItem.productId },
         { name: 'quantity', type: sql.TYPES.Int, value: orderItem.quantity },
      ]
      const updateQuantityQuery = `UPDATE SANPHAM SET SOLUONGTON = SOLUONGTON - @quantity WHERE MASP = @productId`
      await executeQuery(updateQuantityQuery, updateQuantityParams)
      // await connectionPool.then((pool) =>
      //    pool
      //       .request()
      //       .input('productId', sql.TYPES.VarChar, orderItem.productId)
      //       .input('quantity', sql.TYPES.Int, orderItem.quantity)
      //       .query(`UPDATE SANPHAM SET SOLUONGTON = SOLUONGTON - @quantity WHERE MASP = @productId`),
      // )
   })
}

async function countAllInvoiceInfo(customerId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool.request().input('customerId', sql.TYPES.VarChar, customerId).query(`
   //       SELECT
   // 			(SELECT COUNT(*) FROM HOADON WHERE HOADON.MAHD = H.MAHD AND TRANGTHAI = 'delivering') AS SOSPDANGGIAO ,
   // 			(SELECT COUNT(*) FROM HOADON WHERE HOADON.MAHD = H.MAHD AND TRANGTHAI = 'delivered') AS SOSPDAGIAO,
   // 			(SELECT COUNT(*) FROM HOADON WHERE HOADON.MAHD = H.MAHD AND TRANGTHAI = 'canceled') AS SOSPDAHUY
   // 		FROM
   //          HOADON H
   //       WHERE MAKH = @customerId`),
   //    )
   //    .then((customerInvoiceCnt) => customerInvoiceCnt.recordset[0])
   const params = [{ name: 'customerId', type: sql.TYPES.VarChar, value: customerId }]
   const query = `
      SELECT
         (SELECT COUNT(*) FROM HOADON WHERE HOADON.MAHD = H.MAHD AND TRANGTHAI = 'delivering') AS SOSPDANGGIAO ,
         (SELECT COUNT(*) FROM HOADON WHERE HOADON.MAHD = H.MAHD AND TRANGTHAI = 'delivered') AS SOSPDAGIAO,
         (SELECT COUNT(*) FROM HOADON WHERE HOADON.MAHD = H.MAHD AND TRANGTHAI = 'canceled') AS SOSPDAHUY
      FROM
         HOADON H
      WHERE MAKH = @customerId`
   const results = await executeQuery(query, params)
   return results[0]
}

async function confirmInvoice(invoiceId) {
   // return await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('invoiceId', sql.TYPES.VarChar, invoiceId)
   //       .query(`UPDATE HOADON SET TRANGTHAI = 'delivered' WHERE MAHD = @invoiceId`),
   // )
   const params = [{ name: 'invoiceId', type: sql.TYPES.VarChar, value: invoiceId }]
   const query = `UPDATE HOADON SET TRANGTHAI = 'delivered' WHERE MAHD = @invoiceId`
   await executeQuery(query, params)
}

async function printInvoice(invoiceId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool.request().input('invoiceId', sql.TYPES.VarChar, invoiceId).query(`
   //          SELECT
   //             MAHD,
   //             TENKH,
   //             DIACHIGIAO,
   //             SDTKH,
   //             TENNV,
   //             TONGTIEN,
   //             HOADON.NGAYTAO,
   //             TRANGTHAI,
   //             (SELECT
   //                TENKM,
   //                GIAKM,
   //                TENSP
   //             FROM
   //                KHUYENMAI
   //                INNER JOIN HD_CO_KHUYEN_MAI ON KHUYENMAI.MAKM = HD_CO_KHUYEN_MAI.MAKM
   //                INNER JOIN SANPHAM ON KHUYENMAI.MASP = SANPHAM.MASP
   //             WHERE
   //                MAHD = HOADON.MAHD
   // 				FOR JSON PATH) AS DANHSACHKHUYENMAI,
   //             (SELECT TENSP, GIA, SOLUONGSP, TONGTIEN FROM CTHOADON INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP WHERE CTHOADON.MAHD = HOADON.MAHD FOR JSON PATH) AS DANHSACHSANPHAM
   //          FROM
   //             HOADON
   //             INNER JOIN KHACHHANG ON HOADON.MAKH = KHACHHANG.MAKH
   //             INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH
   //             INNER JOIN NHANVIEN ON HOADON.MANV = NHANVIEN.MANV
   //          WHERE
   //             MACDINH = 'True' AND MAHD = @invoiceId`),
   //    )
   //    .then((invoiceInfo) => {
   //       const discountList = invoiceInfo.recordset[0]?.DANHSACHKHUYENMAI
   //          ? JSON.parse(invoiceInfo.recordset[0]?.DANHSACHKHUYENMAI)
   //          : []
   //       const productList = invoiceInfo.recordset[0]?.DANHSACHSANPHAM
   //          ? JSON.parse(invoiceInfo.recordset[0]?.DANHSACHSANPHAM)
   //          : []
   //       return {
   //          ...invoiceInfo.recordset[0],
   //          DANHSACHKHUYENMAI: discountList,
   //          DANHSACHSANPHAM: productList,
   //       }
   //    })
   const params = [{ name: 'invoiceId', type: sql.TYPES.VarChar, value: invoiceId }]
   const query = `
      SELECT
         MAHD,
         TENKH,
         DIACHIGIAO,
         SDTKH,
         TENNV,
         TONGTIEN,
         HOADON.NGAYTAO,
         TRANGTHAI,
         (SELECT
            TENKM,
            GIAKM,
            TENSP
         FROM
            KHUYENMAI
            INNER JOIN HD_CO_KHUYEN_MAI ON KHUYENMAI.MAKM = HD_CO_KHUYEN_MAI.MAKM
            INNER JOIN SANPHAM ON KHUYENMAI.MASP = SANPHAM.MASP
         WHERE
            MAHD = HOADON.MAHD
         FOR JSON PATH) AS DANHSACHKHUYENMAI,
         (SELECT TENSP, GIA, SOLUONGSP, TONGTIEN FROM CTHOADON INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP WHERE CTHOADON.MAHD = HOADON.MAHD FOR JSON PATH) AS DANHSACHSANPHAM
      FROM
         HOADON
         INNER JOIN KHACHHANG ON HOADON.MAKH = KHACHHANG.MAKH
         INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH
         INNER JOIN NHANVIEN ON HOADON.MANV = NHANVIEN.MANV
      WHERE
         MACDINH = 'True' AND MAHD = @invoiceId`
   const results = await executeQuery(query, params)
   const discountList = results[0]?.DANHSACHKHUYENMAI ? JSON.parse(results[0]?.DANHSACHKHUYENMAI) : []
   const productList = results[0]?.DANHSACHSANPHAM ? JSON.parse(results[0]?.DANHSACHSANPHAM) : []
   return {
      ...results[0],
      DANHSACHKHUYENMAI: discountList,
      DANHSACHSANPHAM: productList,
   }
}

async function statistical(startDate, endDate) {
   // const bestProduct = await connectionPool
   //    .then((pool) =>
   //       pool
   //          .request()
   //          .input('startDate', sql.TYPES.DateTimeOffset, startDate)
   //          .input('endDate', sql.TYPES.DateTimeOffset, endDate).query(`
   //          SELECT
   //             TOP 1 TENSP,
   //             SUM(SOLUONGSP) AS SLBAN
   //          FROM
   //             CTHOADON
   //             INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP
   //             INNER JOIN HOADON ON CTHOADON.MAHD = HOADON.MAHD
   //          WHERE
   //             HOADON.NGAYTAO BETWEEN @startDate and @endDate
   //          GROUP BY TENSP
   //          ORDER BY SLBAN DESC`),
   //    )
   //    .then((bestProduct) => bestProduct.recordset[0])
   const params = [
      { name: 'startDate', type: sql.TYPES.DateTimeOffset, value: startDate },
      { name: 'endDate', type: sql.TYPES.DateTimeOffset, value: endDate },
   ]

   const bestProductQuery = `
      SELECT 
         TOP 1 TENSP, 
         SUM(SOLUONGSP) AS SLBAN 
      FROM 
         CTHOADON 
         INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP 
         INNER JOIN HOADON ON CTHOADON.MAHD = HOADON.MAHD 
      WHERE 
         HOADON.NGAYTAO BETWEEN @startDate and @endDate 
      GROUP BY TENSP 
      ORDER BY SLBAN DESC`
   const bestProduct = await executeQuery(bestProductQuery, params)

   // const lastProduct = await connectionPool
   //    .then((pool) =>
   //       pool
   //          .request()
   //          .input('startDate', sql.TYPES.DateTimeOffset, startDate)
   //          .input('endDate', sql.TYPES.DateTimeOffset, endDate).query(`
   //          SELECT
   //             TOP 1 TENSP,
   //             SUM(SOLUONGSP) AS SLBAN
   //          FROM
   //             CTHOADON
   //             INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP
   //             INNER JOIN HOADON ON CTHOADON.MAHD = HOADON.MAHD
   //          WHERE
   //             HOADON.NGAYTAO BETWEEN @startDate and @endDate
   //          GROUP BY TENSP
   //          ORDER BY SLBAN ASC`),
   //    )
   //    .then((lastProduct) => lastProduct.recordset[0])
   const lastProductQuery = `
      SELECT
         TOP 1 TENSP,
         SUM(SOLUONGSP) AS SLBAN
      FROM
         CTHOADON
         INNER JOIN SANPHAM ON CTHOADON.MASP = SANPHAM.MASP
         INNER JOIN HOADON ON CTHOADON.MAHD = HOADON.MAHD
      WHERE
         HOADON.NGAYTAO BETWEEN @startDate and @endDate
      GROUP BY TENSP
      ORDER BY SLBAN ASC`
   const lastProduct = await executeQuery(lastProductQuery, params)

   const totalPriceQuery = `
      SELECT
         SUM(SOLUONGSP) AS TONGSODABAN,
         (SELECT SUM(HOADON.TONGTIEN) FROM HOADON WHERE HOADON.NGAYTAO BETWEEN @startDate AND @endDate) AS TONGDOANHTHU
      FROM
         CTHOADON
         INNER JOIN HOADON ON CTHOADON.MAHD = HOADON.MAHD
      WHERE HOADON.NGAYTAO BETWEEN @startDate AND @endDate`
   const totalPrice = await executeQuery(totalPriceQuery, params)

   return {
      bestProduct: bestProduct[0],
      lastProduct: lastProduct[0],
      totalPrice: totalPrice[0],
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
   getSearchResults,
}
