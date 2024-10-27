require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const connectionPool = require('../config/dbConfig')
const { CreateKey, GetDate } = require('../utils/lib')
const sql = require('mssql')
const salt = 10

async function createCustomer(data) {
   const columns = [
      'MaKH',
      'TenKH',
      'NgaySinhKH',
      'DiaChiKH',
      'SDTKH',
      'EmailKH',
      'MatKhauKH',
      'NgayTao',
      'NgayCapNhat',
   ]
   const { name, birdth, address, phoneNumber, email, password } = data
   const customerId = CreateKey('KH_')
   const createAt = GetDate()
   const updateAt = GetDate()
   const hashPassword = await bcrypt.hash(password, salt)
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('customerId', sql.TYPES.VarChar, customerId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('birdth', sql.TYPES.DateTimeOffset, birdth)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('password', sql.TYPES.VarChar, hashPassword)
         .input('createAt', sql.TYPES.DateTimeOffset, createAt)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`INSERT INTO KHACHHANG (${columns}) VALUES(
                    @customerId,
                    @name,
                    @birdth,
                    @address,
                    @phoneNumber,
                    @email,
                    @password,
                    @createAt,
                    @updateAt)`)
   })
}

async function login(email, password) {
   const customer = await getCustomerByEmail(email)
   if (customer) {
      return bcrypt.compare(password, customer.MATKHAUKH).then((result) => {
         if (result) {
            const payload = {
               customerId: customer.MAKH,
               name: customer.TENKH,
               email: customer.EMAILKH,
               birdth: customer.NGAYSINHKH,
               address: customer.DIACHIKH,
               phoneNumber: customer.SDTKH,
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

async function getCustomerById(customerId) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('customerId', sql.TYPES.VarChar, customerId)
            .query(`SELECT * FROM KHACHHANG WHERE MaKH = @customerId`)
      })
      .then((customer) => customer.recordset[0])
}

async function getCustomerByEmail(email) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('email', sql.TYPES.VarChar, email)
            .query(`SELECT * FROM KHACHHANG WHERE EMAILKH = @email`)
      })
      .then((customer) => customer.recordset[0])
}

async function getAllCustomers(page) {
   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      return await connectionPool
         .then((pool) => {
            return pool.request().query(`SELECT * FROM KHACHHANG
                    ORDER BY NgayTao
                    OFFSET ${skip} ROWS 
                    FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
         })
         .then((customers) => {
            return customers.recordset
         })
   }
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT * FROM KHACHHANG`)
      })
      .then((customers) => {
         return customers.recordset
      })
}

async function updateCustomer(data) {
   const columns = ['MaKH', 'TenKH', 'NgaySinhKH', 'DiaChiKH', 'SDTKH', 'EmailKH', 'NgayCapNhat']
   const { customerId, email, name, birdth, address, phoneNumber } = data
   const updateAt = GetDate()
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('customerId', sql.TYPES.VarChar, customerId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('birdth', sql.TYPES.DateTimeOffset, birdth)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
         .input('email', sql.TYPES.VarChar, email)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`UPDATE KHACHHANG SET
                ${columns[1]} = @name,
                ${columns[2]} = @birdth,
                ${columns[3]} = @address,
                ${columns[4]} = @phoneNumber,
                ${columns[5]} = @email,
                ${columns[6]} = @updateAt
                WHERE ${columns[0]} = @customerId`)
   })
}

async function deleteCustomer(customerId) {
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('customerId', sql.TYPES.VarChar, customerId)
         .query('DELETE KHACHHANG WHERE MaKH = @customerId')
   })
}

module.exports = {
   createCustomer,
   login,
   getCustomerById,
   getCustomerByEmail,
   getAllCustomers,
   updateCustomer,
   deleteCustomer,
}
