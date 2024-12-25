const { connectionPool, executeQuery } = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')

const columns = ['MAGIOHANG', 'MAKH', 'NGAYTAO', 'NGAYCAPNHAT']
const cartItemColumns = ['MAGIOHANG', 'MAMAUSP', 'MASP', 'MACAUHINH', 'SOLUONGSP', 'GIA', 'TONGTIEN', 'TRANGTHAI']
const cartItemDiscountColumns = ['MAGIOHANG', 'MAMAUSP', 'MASP', 'MACAUHINH', 'MAKM']

async function createCart(customerId) {
   const cartId = CreateKey('GH_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('cartId', sql.TYPES.VarChar, cartId)
   //       .input('customerId', sql.TYPES.VarChar, customerId)
   //       .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
   //       .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO GIOHANG (${columns}) VALUES (
   //          @cartId,
   //          @customerId,
   //          @createdAt,
   //          @updatedAt)`),
   // )
   const params = [
      { name: 'cartId', type: sql.TYPES.VarChar, value: cartId },
      { name: 'customerId', type: sql.TYPES.VarChar, value: customerId },
      { name: 'createdAt', type: sql.TYPES.DateTimeOffset, value: createdAt },
      { name: 'updatedAt', type: sql.TYPES.DateTimeOffset, value: updatedAt },
   ]
   const query = `
      INSERT INTO GIOHANG (${columns}) VALUES (
         @cartId,
         @customerId,
         @createdAt,
         @updatedAt)`
   await executeQuery(query, params)
}

async function getCartByCustomerId(customerId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool.request().input('customerId', sql.TYPES.VarChar, customerId)
   //          .query(`SELECT GIOHANG.MAGIOHANG, (SELECT COUNT(*) FROM CTGIOHANG WHERE CTGIOHANG.MAGIOHANG = GIOHANG.MAGIOHANG AND TRANGTHAI = 'in-cart') AS SOSPTRONGGIO,
   // 			(SELECT COUNT(*) FROM CTGIOHANG WHERE CTGIOHANG.MAGIOHANG = GIOHANG.MAGIOHANG AND TRANGTHAI = 'pending') AS SOSPCHODUYET
   // 			FROM GIOHANG WHERE MAKH = @customerId`),
   //    )
   //    .then((cartInfo) => cartInfo.recordset[0])
   const params = [{ name: 'customerId', type: sql.TYPES.VarChar, value: customerId }]
   const query = `
      SELECT 
         GIOHANG.MAGIOHANG, 
         (SELECT COUNT(*) FROM CTGIOHANG WHERE CTGIOHANG.MAGIOHANG = GIOHANG.MAGIOHANG AND TRANGTHAI = 'in-cart') AS SOSPTRONGGIO,
         (SELECT COUNT(*) FROM CTGIOHANG WHERE CTGIOHANG.MAGIOHANG = GIOHANG.MAGIOHANG AND TRANGTHAI = 'pending') AS SOSPCHODUYET
		FROM 
         GIOHANG WHERE MAKH = @customerId`
   const results = await executeQuery(query, params)
   return results[0]
}

async function getCartItems(cartId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool.request().input('cartId', sql.TYPES.VarChar, cartId).query(`
   //             SELECT
   //                CTGIOHANG.MAGIOHANG,
   //                CTGIOHANG.MASP,
   //                CTGIOHANG.MACAUHINH,
   //                CTGIOHANG.MAMAUSP,
   //                TENSP,
   //                (SELECT TOP 1  ANHSP FROM ANHSANPHAM WHERE MASP = CTGIOHANG.MASP ORDER BY MAANH) AS ANHSP,
   //                SOLUONGTON,
   //                DUNGLUONG,
   //                CPU,
   //                GPU,
   //                RAM,
   //                TENMAUSP,
   //                SOLUONGSP,
   //                GIA,
   //                TONGTIEN,
   //                TRANGTHAI,
   //                (SELECT
   //                   KHUYENMAI.MAKM,
   //                   TENKM,
   //                   GIAKM,
   //                   NGAYBATDAU,
   //                   NGAYKETTHUC
   //                FROM
   //                   KHUYENMAI
   //                   INNER JOIN SAN_PHAM_CO_KHUYEN_MAI ON KHUYENMAI.MASP = SAN_PHAM_CO_KHUYEN_MAI.MASP
   //                WHERE
   //                   KHUYENMAI.MASP = CTGIOHANG.MASP
   //                   FOR JSON PATH) AS DANHSACHKHUYENMAI
   //             FROM
   //                GIOHANG
   //                INNER JOIN CTGIOHANG ON GIOHANG.MAGIOHANG = CTGIOHANG.MAGIOHANG
   //                INNER JOIN SANPHAM ON CTGIOHANG.MASP = SANPHAM.MASP
   //                INNER JOIN CAUHINH ON CTGIOHANG.MACAUHINH = CAUHINH.MACAUHINH
   //                INNER JOIN MAUSP ON CTGIOHANG.MAMAUSP = MAUSP.MAMAUSP
   //             WHERE
   //                GIOHANG.MAGIOHANG =  @cartId`),
   //    )
   //    .then((cartItems) =>
   //       cartItems.recordset?.map((cartItem) => {
   //          return {
   //             ...cartItem,
   //             DANHSACHKHUYENMAI: cartItem.DANHSACHKHUYENMAI ? JSON.parse(cartItem.DANHSACHKHUYENMAI) : [],
   //          }
   //       }),
   //    )
   const params = [{ name: 'cartId', type: sql.TYPES.VarChar, value: cartId }]
   const query = `
      SELECT
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
         GIOHANG.MAGIOHANG =  @cartId`
   return await executeQuery(query, params)
}

async function getCartItem(cartId, productColorId, productId, productConfigurationId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool
   //          .request()
   //          .input('cartId', sql.TYPES.VarChar, cartId)
   //          .input('productId', sql.TYPES.VarChar, productId)
   //          .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
   //          .input('productColorId', sql.TYPES.VarChar, productColorId)
   //          .query(
   //             `SELECT * FROM CTGIOHANG WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`,
   //          ),
   //    )
   //    .then((cartItem) => cartItem.recordset[0])
   const params = [
      { name: 'cartId', type: sql.TYPES.VarChar, value: cartId },
      { name: 'productId', type: sql.TYPES.VarChar, value: productId },
      { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: productConfigurationId },
      { name: 'productColorId', type: sql.TYPES.VarChar, value: productColorId },
   ]
   const query = `
      SELECT 
         * 
      FROM 
         CTGIOHANG 
      WHERE 
         MAGIOHANG = @cartId AND MASP = @productId 
         AND MACAUHINH = @productConfigurationId 
         AND MAMAUSP = @productColorId`
   const results = await executeQuery(query, params)
   return results[0]
}

async function addCartItem(cartItem) {
   const {
      cartId,
      productId,
      productConfigurationId,
      productColorId,
      quantity,
      price,
      totalPrice,
      productDiscountIds,
   } = cartItem
   const cartItemExits = await getCartItem(cartId, productColorId, productId, productConfigurationId)
   if (cartItemExits) {
      cartItem.quantity = cartItem.quantity + cartItemExits.SOLUONGSP
      cartItem.totalPrice = cartItem.quantity * cartItem.price
      await updateCartItem(cartItem)
   } else {
      const status = 'in-cart'
      // await connectionPool.then((pool) =>
      //    pool
      //       .request()
      //       .input('cartId', sql.TYPES.VarChar, cartId)
      //       .input('productId', sql.TYPES.VarChar, productId)
      //       .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
      //       .input('productColorId', sql.TYPES.VarChar, productColorId)
      //       .input('quantity', sql.TYPES.Int, quantity)
      //       .input('price', sql.TYPES.Float, price)
      //       .input('totalPrice', sql.TYPES.Float, totalPrice)
      //       .input('status', sql.TYPES.VarChar, status).query(`INSERT INTO CTGIOHANG (${cartItemColumns}) VALUES (
      //          @cartId,
      //          @productColorId,
      //          @productId,
      //          @productConfigurationId,
      //          @quantity,
      //          @price,
      //          @totalPrice,
      //          @status)`),
      // )

      const params = [
         { name: 'cartId', type: sql.TYPES.VarChar, value: cartId },
         { name: 'productId', type: sql.TYPES.VarChar, value: productId },
         { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: productConfigurationId },
         { name: 'productColorId', type: sql.TYPES.VarChar, value: productColorId },
         { name: 'quantity', type: sql.TYPES.Int, value: quantity },
         { name: 'price', type: sql.TYPES.Float, value: price },
         { name: 'totalPrice', type: sql.TYPES.Float, value: totalPrice },
         { name: 'status', type: sql.TYPES.VarChar, value: status },
      ]
      const query = `
         INSERT INTO CTGIOHANG (${cartItemColumns}) VALUES (
            @cartId,
            @productColorId,
            @productId,
            @productConfigurationId,
            @quantity,
            @price,
            @totalPrice,
            @status)`
      await executeQuery(query, params)
   }
   if (productDiscountIds) {
      productDiscountIds.forEach(
         async (productDiscountId) =>
            await createCartItemDiscount(cartId, productColorId, productId, productConfigurationId, productDiscountId),
      )
   }
}

async function updateCartItem(cartItem) {
   const {
      cartId,
      productId,
      productConfigurationId,
      productColorId,
      quantity,
      price,
      totalPrice,
      productDiscountIds,
   } = cartItem
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('cartId', sql.TYPES.VarChar, cartId)
   //       .input('productId', sql.TYPES.VarChar, productId)
   //       .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
   //       .input('productColorId', sql.TYPES.VarChar, productColorId)
   //       .input('quantity', sql.TYPES.Int, quantity)
   //       .input('price', sql.TYPES.Float, price)
   //       .input('totalPrice', sql.TYPES.Float, totalPrice).query(`UPDATE CTGIOHANG SET
   //          ${cartItemColumns[4]} = @quantity,
   //          ${cartItemColumns[5]} = @price,
   //          ${cartItemColumns[6]} = @totalPrice
   //          WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`),
   // )

   const params = [
      { name: 'cartId', type: sql.TYPES.VarChar, value: cartId },
      { name: 'productId', type: sql.TYPES.VarChar, value: productId },
      { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: productConfigurationId },
      { name: 'productColorId', type: sql.TYPES.VarChar, value: productColorId },
      { name: 'quantity', type: sql.TYPES.Int, value: quantity },
      { name: 'price', type: sql.TYPES.Float, value: price },
      { name: 'totalPrice', type: sql.TYPES.Float, value: totalPrice },
   ]
   const query = `
      UPDATE CTGIOHANG SET
         ${cartItemColumns[4]} = @quantity,
         ${cartItemColumns[5]} = @price,
         ${cartItemColumns[6]} = @totalPrice
      WHERE
         MAGIOHANG = @cartId 
         AND MASP = @productId 
         AND MACAUHINH = @productConfigurationId 
         AND MAMAUSP = @productColorId`
   await executeQuery(query, params)
   await deleteCartItemDiscount(cartId, productColorId, productId, productConfigurationId)
}

async function deleteCartItem(cartItem) {
   const { cartId, productId, productConfigurationId, productColorId } = cartItem
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('cartId', sql.TYPES.VarChar, cartId)
   //       .input('productId', sql.TYPES.VarChar, productId)
   //       .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
   //       .input('productColorId', sql.TYPES.VarChar, productColorId)
   //       .query(
   //          `DELETE SAN_PHAM_CO_KHUYEN_MAI WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`,
   //       ),
   // )
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('cartId', sql.TYPES.VarChar, cartId)
   //       .input('productId', sql.TYPES.VarChar, productId)
   //       .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
   //       .input('productColorId', sql.TYPES.VarChar, productColorId)
   //       .query(
   //          `DELETE CTGIOHANG WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`,
   //       ),
   // )

   const params = [
      { name: 'cartId', type: sql.TYPES.VarChar, value: cartId },
      { name: 'productId', type: sql.TYPES.VarChar, value: productId },
      { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: productConfigurationId },
      { name: 'productColorId', type: sql.TYPES.VarChar, value: productColorId },
   ]

   await executeQuery(
      `DELETE 
         SAN_PHAM_CO_KHUYEN_MAI 
      WHERE 
         MAGIOHANG = @cartId 
         AND MASP = @productId 
         AND MACAUHINH = @productConfigurationId 
         AND MAMAUSP = @productColorId`,
      params,
   )

   await executeQuery(
      `DELETE 
         CTGIOHANG 
      WHERE 
         MAGIOHANG = @cartId 
         AND MASP = @productId 
         AND MACAUHINH = @productConfigurationId 
         AND MAMAUSP = @productColorId`,
      params,
   )
   await deleteCartItemDiscount(cartId, productColorId, productId, productConfigurationId)
}

async function createCartItemDiscount(cartId, productColorId, productId, productConfigurationId, productDiscountId) {
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('cartId', sql.TYPES.VarChar, cartId)
   //       .input('productId', sql.TYPES.VarChar, productId)
   //       .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
   //       .input('productColorId', sql.TYPES.VarChar, productColorId)
   //       .input('productDiscountId', sql.TYPES.VarChar, productDiscountId)
   //       .query(`INSERT INTO SAN_PHAM_CO_KHUYEN_MAI (${cartItemDiscountColumns}) VALUES (
   //          @cartId,
   //          @productColorId,
   //          @productId,
   //          @productConfigurationId,
   //          @productDiscountId)`),
   // )
   const params = [
      { name: 'cartId', type: sql.TYPES.VarChar, value: cartId },
      { name: 'productId', type: sql.TYPES.VarChar, value: productId },
      { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: productConfigurationId },
      { name: 'productColorId', type: sql.TYPES.VarChar, value: productColorId },
      { name: 'productDiscountId', type: sql.TYPES.VarChar, value: productDiscountId },
   ]
   const query = `
      INSERT INTO SAN_PHAM_CO_KHUYEN_MAI (${cartItemDiscountColumns}) VALUES (
         @cartId,
         @productColorId,
         @productId,
         @productConfigurationId,
         @productDiscountId)`
   await executeQuery(query, params)
}

async function deleteCartItemDiscount(cartId, productColorId, productId, productConfigurationId) {
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('cartId', sql.TYPES.VarChar, cartId)
   //       .input('productId', sql.TYPES.VarChar, productId)
   //       .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
   //       .input('productColorId', sql.TYPES.VarChar, productColorId).query(`DELETE SAN_PHAM_CO_KHUYEN_MAI
   //          WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`),
   // )
   const params = [
      { name: 'cartId', type: sql.TYPES.VarChar, value: cartId },
      { name: 'productId', type: sql.TYPES.VarChar, value: productId },
      { name: 'productConfigurationId', type: sql.TYPES.VarChar, value: productConfigurationId },
      { name: 'productColorId', type: sql.TYPES.VarChar, value: productColorId },
   ]
   const query = `
      DELETE 
         SAN_PHAM_CO_KHUYEN_MAI
      WHERE 
         MAGIOHANG = @cartId 
         AND MASP = @productId 
         AND MACAUHINH = @productConfigurationId 
         AND MAMAUSP = @productColorId`
}

module.exports = {
   createCart,
   getCartByCustomerId,
   getCartItems,
   addCartItem,
   updateCartItem,
   deleteCartItem,
}
