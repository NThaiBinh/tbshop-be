const sql = require('mssql')

const sqlConfig = {
   user: process.env.DB_USER,
   password: process.env.DB_PWD,
   database: process.env.DB_NAME,
   server: process.env.DB_HOST,
   pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
   },
   options: {
      encrypt: true,
      trustServerCertificate: true,
   },
}

const connectionPool = sql.connect(sqlConfig)

async function executeQuery(query, params = []) {
   const pool = await connectionPool
   const request = await pool.request()
   params.forEach((param) => {
      request.input(param.name, param.type, param.value)
   })

   const result = await request.query(query)
   return result.recordset
}

module.exports = {
   connectionPool,
   executeQuery,
}
