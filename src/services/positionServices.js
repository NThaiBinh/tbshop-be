const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { CreateKey, GetDate } = require('../utils/lib')

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

async function getAllPositions(page) {
   if (page) {
      const PAGE_SIZE = 10
      const skip = (parseInt(page) - 1) * PAGE_SIZE
      return await connectionPool
         .then((pool) => {
            return pool.request().query(`SELECT * FROM CHUCVU
                        ORDER BY NgayTao
                        OFFSET ${skip} ROWS
                        FETCH NEXT ${PAGE_SIZE} ROWS ONLY`)
         })
         .then((positions) => positions.recordset)
   }
   return await connectionPool
      .then((pool) => {
         return pool.request().query(`SELECT * FROM CHUCVU`)
      })
      .then((positions) => positions.recordset)
}

async function createPosition(data) {
   const columns = ['MaCV', 'TenCV', 'NgayTao', 'NgayCapNhat']
   const { name } = data
   const positionId = CreateKey('CV_')
   const createdAt = GetDate()
   const updatedAt = GetDate()
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('positionId', sql.TYPES.VarChar, positionId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('createdAt', sql.TYPES.DateTimeOffset, createdAt)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`INSERT INTO CHUCVU (${columns}) VALUES (
                    @positionId,
                    @name,
                    @createdAt,
                    @updatedAt)`)
   })
}

async function updatePosition(data) {
   const columns = ['MaCV', 'TenCV', 'NgayCapNhat']
   const { positionId, name } = data
   const updatedAt = GetDate()
   return await connectionPool.then((pool) => {
      return pool
         .request()
         .input('positionId', sql.TYPES.VarChar, positionId)
         .input('name', sql.TYPES.NVarChar, name)
         .input('updatedAt', sql.TYPES.DateTimeOffset, updatedAt).query(`UPDATE CHUCVU SET
                    ${columns[1]} = @name,
                    ${columns[2]} = @updatedAt
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
