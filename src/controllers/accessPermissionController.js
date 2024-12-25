const { getAllUserAndRoles, updateUserRole } = require('../services/accessPermissionServices')

async function getAllUserAndRolesHandler(req, res) {
   try {
      const userRoles = await getAllUserAndRoles()
      return res.status(200).json({
         code: 'SS',
         data: userRoles,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function updateUserRoleHandler(req, res) {
   const accountId = req.params.accountId
   await updateUserRole(accountId, req.body.roleInfo)
   try {
      return res.status(200).json({
         code: 'SS',
         message: 'Update successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

module.exports = { getAllUserAndRolesHandler, updateUserRoleHandler }
