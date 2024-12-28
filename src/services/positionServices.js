const sql = require('mssql')
const { connectionPool, executeQuery } = require('../config/dbConfig')
const { CreateKey } = require('../utils/lib')

const columns = ['MACV', 'TENCV']

async function getPositionBtId(positionId) {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool
   //          .request()
   //          .input('positionId', sql.TYPES.VarChar, positionId)
   //          .query(`SELECT * FROM CHUCVU WHERE MaCV = @positionId`)
   //    })
   //    .then((position) => position.recordset[0])
   const params = [{ name: 'positionId', type: sql.TYPES.VarChar, value: positionId }]
   const query = `SELECT * FROM CHUCVU WHERE MaCV = @positionId`
   const results = await executeQuery(query, params)
   return results[0]
}

async function getAllPositions() {
   // return await connectionPool
   //    .then((pool) => {
   //       return pool.request().query(`SELECT * FROM CHUCVU`)
   //    })
   //    .then((positions) => positions.recordset)
   const params = []
   const query = `SELECT * FROM CHUCVU`
   return await executeQuery(query, params)
}

async function createPosition(data) {
   const { name } = data
   const positionId = CreateKey('CV_')
   // await connectionPool.then((pool) =>
   //    pool.request().input('positionId', sql.TYPES.VarChar, positionId).input('name', sql.TYPES.NVarChar, name)
   //       .query(`INSERT INTO CHUCVU (${columns}) VALUES (
   //                  @positionId,
   //                  @name)`),
   // )
   const params = [
      { name: 'positionId', type: sql.TYPES.VarChar, value: positionId },
      { name: 'name', type: sql.TYPES.NVarChar, value: name },
   ]
   const query = `INSERT INTO CHUCVU (${columns}) VALUES (@positionId, @name)`
   await executeQuery(query, params)
   return positionId
}

async function updatePosition(data) {
   const { positionId, name } = data
   // return await connectionPool.then((pool) => {
   //    return pool.request().input('positionId', sql.TYPES.VarChar, positionId).input('name', sql.TYPES.NVarChar, name)
   //       .query(`UPDATE CHUCVU SET
   //                  ${columns[1]} = @name
   //                  WHERE ${columns[0]} = @positionId`)
   // })
   const params = [
      { name: 'positionId', type: sql.TYPES.VarChar, value: positionId },
      { name: 'name', type: sql.TYPES.NVarChar, value: name },
   ]
   const query = `UPDATE CHUCVU SET ${columns[1]} = @name WHERE ${columns[0]} = @positionId`
   await executeQuery(query, params)
}

async function deletePosition(positionId) {
   // return await connectionPool.then((pool) => {
   //    return pool
   //       .request()
   //       .input('positionId', sql.TYPES.VarChar, positionId)
   //       .query(`DELETE CHUCVU WHERE MaCV = @positionId`)
   // })
   const params = [{ name: 'positionId', type: sql.TYPES.VarChar, value: positionId }]
   const query = `DELETE CHUCVU WHERE MaCV = @positionId`
   await executeQuery(query, params)
}

module.exports = {
   getPositionBtId,
   getAllPositions,
   createPosition,
   updatePosition,
   deletePosition,
}
