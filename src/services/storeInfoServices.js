const { connectionPool, executeQuery } = require('../config/dbConfig')
const path = require('path')
const fsPromises = require('fs/promises')
const sql = require('mssql')
const columns = ['TENCUAHANG', 'DIACHICUAHANG', 'SDTCUAHANG', 'EMAILCUAHANG', 'LOGO']

async function getStoreInfo() {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool.request().query(`SELECT * FROM THONGTINCUAHANG`)
   //    })
   //    .then((storeInfo) => storeInfo.recordset[0])
   const params = []
   const query = 'SELECT * FROM THONGTINCUAHANG'
   const results = await executeQuery(query, params)
   return results[0]
}

async function createStoreInfo() {
   // await connectionPool.then((pool) =>
   //    pool.request().query(`INSERT INTO THONGTINCUAHANG (${columns}) VALUES (
   //      N'TÊN CỬA HÀNG',
   //      N'ĐỊA CHỈ',
   //      '0987654321',
   //      'admin@gmail.com',
   //      'default-avatar.jpg')`),
   // )

   const params = []
   const query = `
      INSERT INTO 
         THONGTINCUAHANG (${columns}) 
      VALUES (
         N'TÊN CỬA HÀNG',
         N'ĐỊA CHỈ',
        '0987654321',
        'admin@gmail.com',
        'default-avatar.jpg')`
   executeQuery(query, params)
}

async function getLogo() {
   // return await connectionPool
   //    .then((pool) => pool.request().query(`SELECT LOGO FROM THONGTINCUAHANG`))
   //    .then((result) => result.recordset[0])

   const params = []
   const query = 'SELECT LOGO FROM THONGTINCUAHANG'
   const results = await executeQuery(query, params)
   return results[0]
}

async function updateStoreInfo(data) {
   const { name, address, phoneNumber, email, image } = data
   const logo = await getLogo()

   if (logo.LOGO) {
      const filePath = path.join(__dirname, `../public/images/${logo.LOGO}`)
      fsPromises.unlink(filePath).catch((err) => console.log(err))
   }

   // return await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('name', sql.TYPES.NVarChar, name)
   //       .input('address', sql.TYPES.NVarChar, address)
   //       .input('phoneNumber', sql.TYPES.VarChar, phoneNumber)
   //       .input('email', sql.TYPES.VarChar, email)
   //       .input('image', sql.TYPES.VarChar, image).query(`UPDATE THONGTINCUAHANG SET
   //                  ${columns[0]} = @name,
   //                  ${columns[1]} = @address,
   //                  ${columns[2]} = @phoneNumber,
   //                  ${columns[3]} = @email,
   //                  ${columns[4]} = @image`)
   // })

   const params = [
      { name: 'name', type: sql.TYPES.NVarChar, value: name },
      { name: 'address', type: sql.TYPES.NVarChar, value: address },
      { name: 'phoneNumber', type: sql.TYPES.VarChar, value: phoneNumber },
      { name: 'email', type: sql.TYPES.VarChar, value: email },
      { name: 'image', type: sql.TYPES.VarChar, value: image },
   ]
   const query = `
      UPDATE THONGTINCUAHANG SET 
         ${columns[0]} = @name,
         ${columns[1]} = @address,
         ${columns[2]} = @phoneNumber,
         ${columns[3]} = @email,
         ${columns[4]} = @image`
   executeQuery(query, params)
}

module.exports = {
   getStoreInfo,
   createStoreInfo,
   updateStoreInfo,
}
