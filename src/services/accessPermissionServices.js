const connectionPool = require('../config/dbConfig')
const sql = require('mssql')

const roleColumns = ['MAVAITRO', 'MATK']

async function getAllUserAndRoles() {
   return await connectionPool
      .then((pool) =>
         pool.request().query(`
         SELECT 
            MANV, NHANVIEN.MATK, TENDN, TENNV, TENCV, MAVAITRO, LOAITAIKHOAN
         FROM 
            NHANVIEN INNER JOIN TAIKHOAN ON NHANVIEN.MATK = TAIKHOAN.MATK 
            INNER JOIN CHUCVU ON NHANVIEN.MACV = CHUCVU.MACV
            INNER JOIN CO_VAI_TRO ON TAIKHOAN.MATK = CO_VAI_TRO.MATK`),
      )
      .then((userRoleInfo) => userRoleInfo.recordset)
}

async function getAllPermissions() {
   return await connectionPool.then((pool) => pool.request().query('SELECT * FROM QUYEN')).then((permissions) => permissions.recordset)
}

async function createPermissions() {
   await connectionPool.then((pool) =>
      pool.request().query(`INSERT INTO QUYEN VALUES
        ('create', N'Tạo mới', N'Tạo mới tài nguyên'),
        ('edit', N'Chỉnh sửa', N'Chỉnh sửa tài nguyên'),
        ('delete', N'Xóa', N'Xóa tài nguyên'),
        ('view', N'Xem', N'Xem tài nguyên')`),
   )
}

async function getAllRoles() {
   return await connectionPool.then((pool) => pool.request().query('SELECT * FROM VAITRO')).then((roles) => roles.recordset)
}

async function getRoleByAccountId(accountId) {
   return await connectionPool
      .then((pool) =>
         pool.request().input('accountId', sql.TYPES.VarChar, accountId).query('SELECT MAVAITRO FROM CO_VAI_TRO WHERE MATK = @accountId'),
      )
      .then((roleIds) => roleIds.recordset)
}

async function createRoles() {
   await connectionPool.then((pool) =>
      pool.request().query(`INSERT INTO VAITRO VALUES
        ('admin', N'Quản lý', N'Có toàn quyền truy cập'),
        ('editor', N'Chỉnh sửa', N'Có thể xem và chỉnh sửa tài nguyên'),
        ('viewer', N'Xem tài nguyên', N'Chỉ có thể xem tài nguyên')`),
   )
}

async function getAllRolePermission() {
   return await connectionPool.then((pool) => pool.request().query(`SELECT * FROM CO_QUYEN`)).then((rolePermission) => rolePermission.recordset)
}

async function createRolePermission() {
   return connectionPool.then((pool) =>
      pool.request().query(`
         INSERT INTO CO_QUYEN  VALUES
            ('admin', 'create'),
            ('admin', 'edit'),
            ('admin', 'delete'),
            ('admin', 'view'),
            ('editor', 'create'),
            ('editor', 'edit'),
            ('editor', 'view'),
            ('viewer', 'view')`),
   )
}

async function createUserRole(role, accountId) {
   await connectionPool.then((pool) =>
      pool
         .request()
         .input('role', sql.TYPES.VarChar, role)
         .input('accountId', sql.TYPES.VarChar, accountId)
         .query(`INSERT INTO CO_VAI_TRO (${roleColumns}) VALUES (@role, @accountId)`),
   )
}

async function updateUserRole(accountId, roleInfo) {
   await connectionPool.then((pool) =>
      pool
         .request()
         .input('accountId', sql.TYPES.VarChar, accountId)
         .input('roleInfo', sql.TYPES.VarChar, roleInfo)
         .query(`UPDATE CO_VAI_TRO SET MAVAITRO = @roleInfo WHERE MATK = @accountId`),
   )
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
