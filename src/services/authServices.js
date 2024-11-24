require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { createEmployee, getEmployeeAndRolesByAccountId } = require('./employeeServices')
const { createCustomer, getCustomerAndRolesByAccountId } = require('./customerServices')
const { createUserRole } = require('./accessPermissionServices')
const { CreateKey, GetDate } = require('../utils/lib')
const { createCart, getCartByCustomerId } = require('./cartServices')

const columns = ['MATK', 'TENDN', 'MATKHAU', 'LOAITAIKHOAN', 'NGAYTAO', 'NGAYCAPNHAT']

async function getAccountByUserName(userName) {
   return connectionPool
      .then((pool) => pool.request().query(`SELECT * FROM TAIKHOAN WHERE TENDN = '${userName}'`))
      .then((adminAccount) => adminAccount.recordset[0])
}

async function register(registerInfo) {
   const { positionId, name, image, birth, address, phoneNumber, email, userName, password, accountType } = registerInfo
   const accountId = await createAccount(userName, password, accountType)
   if (accountType === 'customer') {
      if (accountId && name) {
         const customerId = await createCustomer({ accountId, name, image, birth, address, phoneNumber, email })
         await createCart(customerId)
      }
   } else {
      if (accountId && positionId && name && phoneNumber && email) {
         await createEmployee({ accountId, positionId, name, birdth, address, phoneNumber, email })
      }
   }
}

async function createAdminAccount() {
   const accountId = await createAccount('admin', 'admin@123', 'employee')
   await createUserRole(['admin'], accountId)
   return accountId
}

async function createAccount(useName, password, accountType) {
   const accountId = CreateKey('TK_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   const hashPassword = await bcrypt.hash(password, 10)
   await connectionPool.then((pool) =>
      pool
         .request()
         .input('accountId', sql.TYPES.VarChar, accountId)
         .input('useName', sql.TYPES.VarChar, useName)
         .input('password', sql.TYPES.VarChar, hashPassword)
         .input('accountType', sql.TYPES.VarChar, accountType)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO TAIKHOAN (${columns}) VALUES (
            @accountId, 
            @useName, 
            @password, 
            @accountType,
            @createdAt, 
            @updatedAt)`),
   )
   return accountId
}

async function login(userName, password) {
   const accountInfo = await getAccountByUserName(userName)
   if (accountInfo) {
      return bcrypt.compare(password, accountInfo.MATKHAU).then(async (result) => {
         if (result) {
            let payload = {
               userType: accountInfo.LOAITAIKHOAN,
            }
            let userInfo = {}
            if (accountInfo.LOAITAIKHOAN === 'employee') {
               userInfo = await getEmployeeAndRolesByAccountId(accountInfo.MATK)
               payload = {
                  ...payload,
                  info: {
                     ...payload,
                     userId: userInfo.MANV,
                     accountId: userInfo.MATK,
                     positionId: userInfo.MACV,
                     name: userInfo.TENNV,
                     image: userInfo.ANHNV,
                     birth: userInfo.NGAYSINHNV,
                     address: userInfo.DIACHINV,
                     phoneNumber: userInfo.SDTNV,
                     email: userInfo.EMAILNV,
                     createdAt: userInfo.NGAYTAO,
                     updatedAt: userInfo.NGAYCAPNHAT,
                     roles: userInfo.QUYEN,
                  },
               }
            } else {
               userInfo = await getCustomerAndRolesByAccountId(accountInfo.MATK)
               const cartInfo = await getCartByCustomerId(userInfo.MAKH)
               payload = {
                  ...payload,
                  info: {
                     userId: userInfo.MAKH,
                     accountId: userInfo.MATK,
                     name: userInfo.TENKH,
                     image: userInfo.ANHKH,
                     birth: userInfo.NGAYSINHKH,
                     address: userInfo.DIACHIKH,
                     phoneNumber: userInfo.SDTKH,
                     email: userInfo.EMAILKH,
                     createdAt: userInfo.NGAYTAO,
                     updatedAt: userInfo.NGAYCAPNHAT,
                     roles: userInfo.QUYEN,
                  },
                  cartInfo: {
                     cartId: cartInfo.MAGIOHANG,
                     quantity: cartInfo.SOSP,
                  },
               }
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
               expiresIn: process.env.JWT_EXPIRE,
            })
            return {
               token,
               payload,
            }
         } else {
            return undefined
         }
      })
   } else {
      return undefined
   }
}

module.exports = {
   login,
   register,
   createAdminAccount,
   getAccountByUserName,
}
