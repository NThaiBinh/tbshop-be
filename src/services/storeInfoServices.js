const connectionPool = require('../config/dbConfig')
const sql = require('mssql')

async function getStoreInfo() {
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT * FROM THONGTINCUAHANG`)
      })
      .then((storeInfo) => storeInfo.recordset[0])
}

async function createStoreInfo() {
   await connectionPool.then((pool) =>
      pool.request().query(`INSERT INTO THONGTINCUAHANG VALUES (
        N'TÊN CỦA HÀNG',
        N'ĐỊA CHỈ',
        '0987654321',
        'admin@gmail.com')`),
   )
}

async function updateStoreInfo(data) {
   const columns = ['TenCuaHang', 'DiaChiCuaHang', 'SDTCuaHang', 'EmailCuaHang']
   const { name, address, phoneNumber, email } = data
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('name', sql.TYPES.NVarChar, name)
         .input('address', sql.TYPES.NVarChar, address)
         .input('phoneNumber', sql.TYPES.NVarChar, phoneNumber)
         .input('email', sql.TYPES.NVarChar, email).query(`UPDATE THONGTINCUAHANG SET
                    ${columns[0]} = @name,
                    ${columns[1]} = @address,
                    ${columns[2]} = @phoneNumber,
                    ${columns[3]} = @email`)
   })
}

module.exports = {
   getStoreInfo,
   createStoreInfo,
   updateStoreInfo,
}
