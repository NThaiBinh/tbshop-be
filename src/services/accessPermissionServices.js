const { connectionPool, executeQuery } = require('../config/dbConfig')
const sql = require('mssql')

const columns = ['MAVAITRO', 'MATK']

async function getAllUserAndRoles() {
   // return await connectionPool
   //    .then((pool) =>
   //       pool.request().query(`
   //       SELECT
   //          MANV, NHANVIEN.MATK, TENDN, TENNV, TENCV, MAVAITRO, LOAITAIKHOAN
   //       FROM
   //          NHANVIEN INNER JOIN TAIKHOAN ON NHANVIEN.MATK = TAIKHOAN.MATK
   //          INNER JOIN CHUCVU ON NHANVIEN.MACV = CHUCVU.MACV
   //          INNER JOIN CO_VAI_TRO ON TAIKHOAN.MATK = CO_VAI_TRO.MATK`),
   //    )
   //    .then((userRoleInfo) => userRoleInfo.recordset)

   const params = []
   const query = `
      SELECT
         MANV, 
         NHANVIEN.MATK, 
         TENDN, 
         TENNV, 
         TENCV, 
         MAVAITRO, 
         LOAITAIKHOAN
      FROM
         NHANVIEN 
         INNER JOIN TAIKHOAN ON NHANVIEN.MATK = TAIKHOAN.MATK
         INNER JOIN CHUCVU ON NHANVIEN.MACV = CHUCVU.MACV
         INNER JOIN CO_VAI_TRO ON TAIKHOAN.MATK = CO_VAI_TRO.MATK`
   return await executeQuery(query, params)
}

async function getAllPermissions() {
   // return await connectionPool
   //    .then((pool) => pool.request().query('SELECT * FROM QUYEN'))
   //    .then((permissions) => permissions.recordset)
   const params = []
   const query = 'SELECT * FROM QUYEN'
   return await executeQuery(query, params)
}

async function createPermissions() {
   // await connectionPool.then((pool) =>
   //    pool.request().query(`INSERT INTO QUYEN VALUES
   //      ('create', N'Tạo mới', N'Tạo mới tài nguyên'),
   //      ('edit', N'Chỉnh sửa', N'Chỉnh sửa tài nguyên'),
   //      ('delete', N'Xóa', N'Xóa tài nguyên'),
   //      ('view', N'Xem', N'Xem tài nguyên')`),
   // )

   const params = []
   const query = `
      INSERT INTO QUYEN VALUES
         ('create', N'Tạo mới', N'Tạo mới tài nguyên'),
         ('edit', N'Chỉnh sửa', N'Chỉnh sửa tài nguyên'),
         ('delete', N'Xóa', N'Xóa tài nguyên'),
         ('view', N'Xem', N'Xem tài nguyên')`
   await executeQuery(query, params)
}

async function getAllRoles() {
   // return await connectionPool
   //    .then((pool) => pool.request().query('SELECT * FROM VAITRO'))
   //    .then((roles) => roles.recordset)
   const params = []
   const query = 'SELECT * FROM VAITRO'
   return await executeQuery(query, params)
}

async function getRoleByAccountId(accountId) {
   // return await connectionPool
   //    .then((pool) =>
   //       pool
   //          .request()
   //          .input('accountId', sql.TYPES.VarChar, accountId)
   //          .query('SELECT MAVAITRO FROM CO_VAI_TRO WHERE MATK = @accountId'),
   //    )
   //    .then((roleIds) => roleIds.recordset)
   const params = [{ name: 'accountId', type: sql.TYPES.VarChar, value: accountId }]
   const query = 'SELECT MAVAITRO FROM CO_VAI_TRO WHERE MATK = @accountId'
   return await executeQuery(query, params)
}

async function createRoles() {
   // await connectionPool.then((pool) =>
   //    pool.request().query(`INSERT INTO VAITRO VALUES
   //      ('admin', N'Quản lý', N'Có toàn quyền truy cập'),
   //      ('editor', N'Chỉnh sửa', N'Có thể xem và chỉnh sửa tài nguyên'),
   //      ('viewer', N'Xem tài nguyên', N'Chỉ có thể xem tài nguyên')`),
   // )

   const params = []
   const query = `
      INSERT INTO VAITRO VALUES
         ('admin', N'Quản lý', N'Có toàn quyền truy cập'),
         ('editor', N'Chỉnh sửa', N'Có thể xem và chỉnh sửa tài nguyên'),
         ('viewer', N'Xem tài nguyên', N'Chỉ có thể xem tài nguyên')`
   await executeQuery(query, params)
}

async function getAllRolePermission() {
   // return await connectionPool
   //    .then((pool) => pool.request().query(`SELECT * FROM CO_QUYEN`))
   //    .then((rolePermission) => rolePermission.recordset)
   const params = []
   const query = 'SELECT * FROM CO_QUYEN'
   return await executeQuery(query, params)
}

async function createRolePermission() {
   // return connectionPool.then((pool) =>
   //    pool.request().query(`
   //       INSERT INTO CO_QUYEN  VALUES
   //          ('admin', 'create'),
   //          ('admin', 'edit'),
   //          ('admin', 'delete'),
   //          ('admin', 'view'),
   //          ('editor', 'create'),
   //          ('editor', 'edit'),
   //          ('editor', 'view'),
   //          ('viewer', 'view')`),
   // )
   const params = []
   const query = `
      INSERT INTO CO_QUYEN  VALUES
         ('admin', 'create'),
         ('admin', 'edit'),
         ('admin', 'delete'),
         ('admin', 'view'),
         ('editor', 'create'),
         ('editor', 'edit'),
         ('editor', 'view'),
         ('viewer', 'view')`
   await executeQuery(query, params)
}

async function createUserRole(role, accountId) {
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('role', sql.TYPES.VarChar, role)
   //       .input('accountId', sql.TYPES.VarChar, accountId)
   //       .query(`INSERT INTO CO_VAI_TRO (${columns}) VALUES (@role, @accountId)`),
   // )

   const params = [
      { name: 'accountId', type: sql.TYPES.VarChar, value: accountId },
      { name: 'role', type: sql.TYPES.VarChar, value: role },
   ]
   const query = `INSERT INTO CO_VAI_TRO (${columns}) VALUES (@role, @accountId)`
   await executeQuery(query, params)
}

async function updateUserRole(accountId, roleInfo) {
   // await connectionPool.then((pool) =>
   //    pool
   //       .request()
   //       .input('accountId', sql.TYPES.VarChar, accountId)
   //       .input('roleInfo', sql.TYPES.VarChar, roleInfo)
   //       .query(`UPDATE CO_VAI_TRO SET MAVAITRO = @roleInfo WHERE MATK = @accountId`),
   // )

   const params = [
      { name: 'accountId', type: sql.TYPES.VarChar, value: accountId },
      { name: 'roleInfo', type: sql.TYPES.VarChar, value: roleInfo },
   ]
   const query = `UPDATE CO_VAI_TRO SET MAVAITRO = @roleInfo WHERE MATK = @accountId`
   await executeQuery(query, params)
}

module.exports = {
   getAllPermissions,
   createPermissions,
   getAllRoles,
   getRoleByAccountId,
   createRoles,
   createRolePermission,
   createUserRole,
   getAllRolePermission,
   getAllUserAndRoles,
   updateUserRole,
}
