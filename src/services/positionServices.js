const sql = require('mssql')
const connectionPool = require('../config/dbConfig')
const { CreateKey } = require('../utils/lib')

const columns = ['MACV', 'TENCV']

async function getPositionBtId(positionId) {
   return await connectionPool
      .then((pool) => {
         return pool
            .request()
            .input('positionId', sql.TYPES.VarChar, positionId)
            .query(`SELECT * FROM CHUCVU WHERE MaCV = @positionId`)
      })
      .then((position) => position.recordset[0])
}

async function getAllPositions() {
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT * FROM CHUCVU`)
      })
      .then((positions) => positions.recordset)
}

async function createPosition(data) {
   const { name } = data
   const positionId = CreateKey('CV_')
   await connectionPool.then((pool) =>
      pool.request().input('positionId', sql.TYPES.VarChar, positionId).input('name', sql.TYPES.NVarChar, name)
         .query(`INSERT INTO CHUCVU (${columns}) VALUES (
                    @positionId,
                    @name)`),
   )
   return positionId
}

async function updatePosition(data) {
   const { positionId, name } = data
   return await connectionPool.then((pool) => {
      return pool.request().input('positionId', sql.TYPES.VarChar, positionId).input('name', sql.TYPES.NVarChar, name)
         .query(`UPDATE CHUCVU SET
                    ${columns[1]} = @name
                    WHERE ${columns[0]} = @positionId`)
   })
}

async function deletePosition(positionId) {
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('positionId', sql.TYPES.VarChar, positionId)
         .query(`DELETE CHUCVU WHERE MaCV = @positionId`)
   })
}

module.exports = {
   getPositionBtId,
   getAllPositions,
   createPosition,
   updatePosition,
   deletePosition,
}
