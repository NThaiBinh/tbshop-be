const { connectionPool, executeQuery } = require('../config/dbConfig')
const sql = require('mssql')

async function getAllOrders() {
   // return await connectionPool
   //    .then((pool) =>
   //       pool.request().query(`
   //                   SELECT
   //          KHACHHANG.MAKH,
   //          TENKH,
   //          DIACHIGIAO,
   //          (SELECT
   //             CTGIOHANG.MAGIOHANG,
   //             CTGIOHANG.MASP,
   //             CTGIOHANG.MACAUHINH,
   //             CTGIOHANG.MAMAUSP,
   //             TENSP,
   //             (SELECT TOP 1  ANHSP FROM ANHSANPHAM WHERE MASP = CTGIOHANG.MASP ORDER BY MAANH) AS ANHSP,
   //             SOLUONGTON,
   //             DUNGLUONG,
   //             CPU,
   //             GPU,
   //             RAM,
   //             TENMAUSP,
   //             SOLUONGSP,
   //             GIA,
   //             TONGTIEN,
   //             TRANGTHAI,
   //             (SELECT
   //                KHUYENMAI.MAKM,
   //                TENKM,
   //                GIAKM,
   //                NGAYBATDAU,
   //                NGAYKETTHUC
   //             FROM
   //                KHUYENMAI
   //                INNER JOIN SAN_PHAM_CO_KHUYEN_MAI ON KHUYENMAI.MASP = SAN_PHAM_CO_KHUYEN_MAI.MASP
   //             WHERE
   //                KHUYENMAI.MASP = CTGIOHANG.MASP
   //                FOR JSON PATH) AS DANHSACHKHUYENMAI
   //          FROM
   //             GIOHANG
   //             INNER JOIN CTGIOHANG ON GIOHANG.MAGIOHANG = CTGIOHANG.MAGIOHANG
   //             INNER JOIN SANPHAM ON CTGIOHANG.MASP = SANPHAM.MASP
   //             INNER JOIN CAUHINH ON CTGIOHANG.MACAUHINH = CAUHINH.MACAUHINH
   //             INNER JOIN MAUSP ON CTGIOHANG.MAMAUSP = MAUSP.MAMAUSP
   //          WHERE
   //             GIOHANG.MAKH = KHACHHANG.MAKH
   //             AND TRANGTHAI = 'pending'
   //             FOR JSON PATH) AS DANHSACHDONHANG
   //       FROM
   //          KHACHHANG INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH
   //       WHERE
   //          MACDINH = 'True'`),
   //    )
   //    .then((orders) => {
   //       return orders.recordset
   //          .map((order) => {
   //             const orderList = order?.DANHSACHDONHANG ? JSON.parse(order.DANHSACHDONHANG) : []

   //             return {
   //                MAKH: order.MAKH,
   //                TENKH: order.TENKH,
   //                DIACHIGIAO: order.DIACHIGIAO,
   //                DANHSACHSANPHAM: orderList,
   //             }
   //          })
   //          .filter((order) => order.DANHSACHSANPHAM.length > 0)
   //    })
   const params = []
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
            (SELECT TOP 1  ANHSP FROM ANHSANPHAM WHERE MASP = CTGIOHANG.MASP ORDER BY MAANH) AS ANHSP, 
            SOLUONGTON, 
            DUNGLUONG, 
            CPU, 
            GPU, 
            RAM, 
            TENMAUSP, 
            SOLUONGSP, 
            GIA, 
            TONGTIEN, 
            TRANGTHAI,
            (SELECT 
               KHUYENMAI.MAKM, 
               TENKM,
               GIAKM, 
               NGAYBATDAU, 
               NGAYKETTHUC 
            FROM
               KHUYENMAI 
               INNER JOIN SAN_PHAM_CO_KHUYEN_MAI ON KHUYENMAI.MASP = SAN_PHAM_CO_KHUYEN_MAI.MASP
            WHERE 
               KHUYENMAI.MASP = CTGIOHANG.MASP 
               FOR JSON PATH) AS DANHSACHKHUYENMAI
         FROM 
            GIOHANG 
            INNER JOIN CTGIOHANG ON GIOHANG.MAGIOHANG = CTGIOHANG.MAGIOHANG 
            INNER JOIN SANPHAM ON CTGIOHANG.MASP = SANPHAM.MASP 
            INNER JOIN CAUHINH ON CTGIOHANG.MACAUHINH = CAUHINH.MACAUHINH 
            INNER JOIN MAUSP ON CTGIOHANG.MAMAUSP = MAUSP.MAMAUSP 
         WHERE 
            GIOHANG.MAKH = KHACHHANG.MAKH 
            AND TRANGTHAI = 'pending' 
            FOR JSON PATH) AS DANHSACHDONHANG
      FROM
         KHACHHANG INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH 
      WHERE 
         MACDINH = 'True'`
   const results = await executeQuery(query, params)
   return results
      .map((order) => {
         const orderList = order?.DANHSACHDONHANG ? JSON.parse(order.DANHSACHDONHANG) : []
         return {
            MAKH: order.MAKH,
            TENKH: order.TENKH,
            DIACHIGIAO: order.DIACHIGIAO,
            DANHSACHSANPHAM: orderList,
         }
      })
      .filter((order) => order.DANHSACHSANPHAM.length > 0)
}

async function createOrder(cartItems = []) {
   if (!Array.isArray(cartItems)) {
      cartItems = [cartItems]
   }
   const query = `
      UPDATE 
         CTGIOHANG SET TRANGTHAI = 'pending'
      WHERE 
         MAGIOHANG = @cartId 
         AND MASP = @productId 
         AND MACAUHINH = @productConfigurationId 
         AND MAMAUSP = @productColorId`
   cartItems.forEach(async (cartItem) => {
      const params = [
         { name: 'cartId', type: sql.TYPES.VarChar, value: cartItem.cartId },
         { name: 'productId', type: sql.TYPES.VarChar, value: cartItem.productId },
         { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: cartItem.productConfigurationId },
         { name: 'productColorId', type: sql.TYPES.VarChar, value: cartItem.productColorId },
      ]
      await executeQuery(query, params)
      // await connectionPool.then((pool) =>
      //    pool
      //       .request()
      //       .input('cartId', sql.TYPES.VarChar, cartItem.cartId)
      //       .input('productId', sql.TYPES.VarChar, cartItem.productId)
      //       .input('productConfigurationId', sql.TYPES.VarChar, cartItem.productConfigurationId)
      //       .input('productColorId', sql.TYPES.VarChar, cartItem.productColorId)
      //       .query(`UPDATE CTGIOHANG SET TRANGTHAI = 'pending'
      //           WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`),
      // )
   })
}

async function cancelOrder(cartItem) {
   const { cartId, productId, productConfigurationId, productColorId } = cartItem
   const params = [
      { name: 'cartId', type: sql.TYPES.VarChar, value: cartId },
      { name: 'productId', type: sql.TYPES.VarChar, value: productId },
      { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: productConfigurationId },
      { name: 'productColorId', type: sql.TYPES.VarChar, value: productColorId },
   ]
   const queryDelDiscount = `
      DELETE
         SAN_PHAM_CO_KHUYEN_MAI
      WHERE
         MAGIOHANG = @cartId 
         AND MASP = @productId 
         AND MACAUHINH = @productConfigurationId 
         AND MAMAUSP = @productColorId`
   await executeQuery(queryDelDiscount, params)
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('cartId', sql.TYPES.VarChar, cartItem.cartId)
   //       .input('productId', sql.TYPES.VarChar, cartItem.productId)
   //       .input('productConfigurationId', sql.TYPES.VarChar, cartItem.productConfigurationId)
   //       .input('productColorId', sql.TYPES.VarChar, cartItem.productColorId).query(`
   //          DELETE
   //             SAN_PHAM_CO_KHUYEN_MAI
   //          WHERE
   //             MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`),
   // )
   const queryDelCt = `
      DELETE
            CTGIOHANG
      WHERE
         MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`
   await executeQuery(queryDelCt, params)
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('cartId', sql.TYPES.VarChar, cartItem.cartId)
   //       .input('productId', sql.TYPES.VarChar, cartItem.productId)
   //       .input('productConfigurationId', sql.TYPES.VarChar, cartItem.productConfigurationId)
   //       .input('productColorId', sql.TYPES.VarChar, cartItem.productColorId).query(`
   //          DELETE
   //              CTGIOHANG
   //          WHERE
   //             MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`),
   // )
}

module.exports = { getAllOrders, createOrder, cancelOrder }
