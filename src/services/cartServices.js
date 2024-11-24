const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')

const columns = ['MAGIOHANG', 'MAKH', 'NGAYTAO', 'NGAYCAPNHAT']
const cartItemColumns = ['MAGIOHANG', 'MAMAUSP', 'MASP', 'MACAUHINH', 'SOLUONGSP', 'GIA', 'TONGTIEN']
const cartItemDiscountColumns = ['MAGIOHANG', 'MAMAUSP', 'MASP', 'MACAUHINH', 'MAKM']

async function createCart(customerId) {
   const cartId = CreateKey('GH_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   await connectionPool.then((pool) =>
      pool
         .request()
         .input('cartId', sql.TYPES.VarChar, cartId)
         .input('customerId', sql.TYPES.VarChar, customerId)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO GIOHANG (${columns}) VALUES (
            @cartId,
            @customerId,
            @createdAt,
            @updatedAt)`),
   )
}

async function getCartByCustomerId(customerId) {
   return await connectionPool
      .then((pool) =>
         pool.request().input('customerId', sql.TYPES.VarChar, customerId)
            .query(`SELECT GIOHANG.MAGIOHANG, COUNT(MASP) AS SOSP 
               FROM GIOHANG LEFT JOIN CTGIOHANG ON GIOHANG.MAGIOHANG = CTGIOHANG.MAGIOHANG 
               WHERE MAKH = @customerId
               GROUP BY GIOHANG.MAGIOHANG`),
      )
      .then((cartInfo) => cartInfo.recordset[0])
}

async function getCartItems(cartId) {
   return await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('cartId', sql.TYPES.VarChar, cartId)
            .query(
               `SELECT CTGIOHANG.MAGIOHANG, CTGIOHANG.MASP, CTGIOHANG.MACAUHINH, CTGIOHANG.MAMAUSP, TENSP, (SELECT TOP 1  ANHSP FROM ANHSANPHAM WHERE MASP = CTGIOHANG.MASP ORDER BY MAANH) AS ANHSP, 
               SOLUONGTON, DUNGLUONG, CPU, GPU, RAM, TENMAUSP, SOLUONGSP, GIA, TONGTIEN 
               FROM GIOHANG INNER JOIN CTGIOHANG ON GIOHANG.MAGIOHANG = CTGIOHANG.MAGIOHANG 
               INNER JOIN SANPHAM ON CTGIOHANG.MASP = SANPHAM.MASP 
               INNER JOIN CAUHINH ON CTGIOHANG.MACAUHINH = CAUHINH.MACAUHINH 
               INNER JOIN MAUSP ON CTGIOHANG.MAMAUSP = MAUSP.MAMAUSP WHERE GIOHANG.MAGIOHANG =  @cartId`,
            ),
      )
      .then((cartItems) => cartItems.recordset)
}

async function getCartItem(cartId, productColorId, productId, productConfigurationId) {
   return await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('cartId', sql.TYPES.VarChar, cartId)
            .input('productId', sql.TYPES.VarChar, productId)
            .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
            .input('productColorId', sql.TYPES.VarChar, productColorId)
            .query(
               `SELECT * FROM CTGIOHANG WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`,
            ),
      )
      .then((cartItem) => cartItem.recordset[0])
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
      await connectionPool.then((pool) =>
         pool
            .request()
            .input('cartId', sql.TYPES.VarChar, cartId)
            .input('productId', sql.TYPES.VarChar, productId)
            .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
            .input('productColorId', sql.TYPES.VarChar, productColorId)
            .input('quantity', sql.TYPES.Int, quantity)
            .input('price', sql.TYPES.Float, price)
            .input('totalPrice', sql.TYPES.Float, totalPrice).query(`INSERT INTO CTGIOHANG (${cartItemColumns}) VALUES (
               @cartId,
               @productColorId,
               @productId,
               @productConfigurationId,
               @quantity,
               @price,
               @totalPrice)`),
      )
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
   await connectionPool.then((pool) =>
      pool
         .request()
         .input('cartId', sql.TYPES.VarChar, cartId)
         .input('productId', sql.TYPES.VarChar, productId)
         .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
         .input('productColorId', sql.TYPES.VarChar, productColorId)
         .input('quantity', sql.TYPES.Int, quantity)
         .input('price', sql.TYPES.Float, price)
         .input('totalPrice', sql.TYPES.Float, totalPrice).query(`UPDATE CTGIOHANG SET 
            ${cartItemColumns[4]} = @quantity,
            ${cartItemColumns[5]} = @price,
            ${cartItemColumns[6]} = @totalPrice
            WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`),
   )
   await deleteCartItemDiscount(cartId, productColorId, productId, productConfigurationId)
}

async function deleteCartItem(cartItem) {
   const { cartId, productId, productConfigurationId, productColorId } = cartItem
   await connectionPool.then((pool) =>
      pool
         .request()
         .input('cartId', sql.TYPES.VarChar, cartId)
         .input('productId', sql.TYPES.VarChar, productId)
         .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
         .input('productColorId', sql.TYPES.VarChar, productColorId)
         .query(
            `DELETE CTGIOHANG WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`,
         ),
   )
   await deleteCartItemDiscount(cartId, productColorId, productId, productConfigurationId)
}

async function createCartItemDiscount(cartId, productColorId, productId, productConfigurationId, productDiscountId) {
   await connectionPool.then((pool) =>
      pool
         .request()
         .input('cartId', sql.TYPES.VarChar, cartId)
         .input('productId', sql.TYPES.VarChar, productId)
         .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
         .input('productColorId', sql.TYPES.VarChar, productColorId)
         .input('productDiscountId', sql.TYPES.VarChar, productDiscountId)
         .query(`INSERT INTO SAN_PHAM_CO_KHUYEN_MAI (${cartItemDiscountColumns}) VALUES (
            @cartId,
            @productColorId,
            @productId,
            @productConfigurationId,
            @productDiscountId)`),
   )
}

async function deleteCartItemDiscount(cartId, productColorId, productId, productConfigurationId) {
   await connectionPool.then((pool) =>
      pool
         .request()
         .input('cartId', sql.TYPES.VarChar, cartId)
         .input('productId', sql.TYPES.VarChar, productId)
         .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
         .input('productColorId', sql.TYPES.VarChar, productColorId).query(`DELETE SAN_PHAM_CO_KHUYEN_MAI 
            WHERE MAGIOHANG = @cartId AND MASP = @productId AND MACAUHINH = @productConfigurationId AND MAMAUSP = @productColorId`),
   )
}

module.exports = { createCart, getCartByCustomerId, getCartItems, addCartItem, updateCartItem, deleteCartItem }
