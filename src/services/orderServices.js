const connectionPool = require('../config/dbConfig')
const sql = require('mssql')

async function getAllOrders() {
   return await connectionPool
      .then((pool) =>
         pool.request().query(`
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
            MACDINH = 'True'`),
      )
      .then((orders) => {
         return orders.recordset
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
      })
}

async function createOrder(cartItems = []) {
   if (!Array.isArray(cartItems)) {
      cartItems = [cartItems]
   }
   cartItems.forEach(async (cartItem) => {
      await connectionPool.then((pool) =>
         pool
            .request()
            .input('cartId', sql.TYPES.VarChar, cartItem.cartId)
            .input('productId', sql.TYPES.VarChar, cartItem.productId)
            .input('productConfigurationId', sql.TYPES.VarChar, cartItem.productConfigurationId)
            .input('productColorId', sql.TYPES.VarChar, cartItem.productColorId)
            .query(`UPDATE CTGIOHANG SET TRANGTHAI = 'pending' 
                WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`),
      )
   })
}

async function cancelOrder(cartItem) {
   await connectionPool.then((pool) =>
      pool
         .request()
         .input('cartId', sql.TYPES.VarChar, cartItem.cartId)
         .input('productId', sql.TYPES.VarChar, cartItem.productId)
         .input('productConfigurationId', sql.TYPES.VarChar, cartItem.productConfigurationId)
         .input('productColorId', sql.TYPES.VarChar, cartItem.productColorId).query(`
            DELETE 
               SAN_PHAM_CO_KHUYEN_MAI 
            WHERE 
               MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`),
   )

   await connectionPool.then((pool) =>
      pool
         .request()
         .input('cartId', sql.TYPES.VarChar, cartItem.cartId)
         .input('productId', sql.TYPES.VarChar, cartItem.productId)
         .input('productConfigurationId', sql.TYPES.VarChar, cartItem.productConfigurationId)
         .input('productColorId', sql.TYPES.VarChar, cartItem.productColorId).query(`
            DELETE 
                CTGIOHANG
            WHERE 
               MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`),
   )
}

async function getSearchResults(q) {
   const query = `%${q}%`

   if (q) {
      return await connectionPool.then((pool) =>
         pool
            .request()
            .input('query', sql.TYPES.NVarChar, query)
            .query(
               `SELECT 
                  KHACHHANG.MAKH, TENKH, DIACHIGIAO, 
                  (SELECT 
                     CTGIOHANG.MAGIOHANG, CTGIOHANG.MASP, CTGIOHANG.MACAUHINH, CTGIOHANG.MAMAUSP, TENSP, 
                     (SELECT TOP 1  ANHSP FROM ANHSANPHAM WHERE MASP = CTGIOHANG.MASP ORDER BY MAANH) AS ANHSP, 
                     SOLUONGTON, DUNGLUONG, CPU, GPU, RAM, TENMAUSP, SOLUONGSP, GIA, TONGTIEN, TRANGTHAI
                  FROM 
                     GIOHANG INNER JOIN CTGIOHANG ON GIOHANG.MAGIOHANG = CTGIOHANG.MAGIOHANG 
                     INNER JOIN SANPHAM ON CTGIOHANG.MASP = SANPHAM.MASP 
                     INNER JOIN CAUHINH ON CTGIOHANG.MACAUHINH = CAUHINH.MACAUHINH 
                     INNER JOIN MAUSP ON CTGIOHANG.MAMAUSP = MAUSP.MAMAUSP 
                  WHERE 
                     GIOHANG.MAKH = KHACHHANG.MAKH AND TRANGTHAI = 'pending' FOR JSON PATH) AS DANHSACHDONHANG
               FROM 
                  KHACHHANG INNER JOIN DIACHIGIAOHANG ON KHACHHANG.MAKH = DIACHIGIAOHANG.MAKH 
               WHERE MACDINH = 'True' AND TENKH LIKE @query`,
            )
            .then((searchResults) => {
               return searchResults.recordset
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
            }),
      )
   } else {
      return await getAllOrders()
   }
}

module.exports = { getAllOrders, createOrder, cancelOrder, getSearchResults }
