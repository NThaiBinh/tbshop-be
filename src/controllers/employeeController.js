const { getAllEmployees, createEmployee, getEmployeeInfoAndRolesById } = require('../services/employeeServices')

async function getAllEmployeeHandler(req, res) {
   try {
      const page = req.query.page
      const employees = await getAllEmployees(page)
      return res.status(200).json(employees)
   } catch (err) {
      return res.status(500).json({
         meaasge: 'Server error',
         err,
      })
   }
}

async function createEmployeeHandler(req, res) {
   const { positionId, name, birdth, address, phoneNumber, email } = req.body
   if (!positionId || !name || !phoneNumber || !email) {
      return res.status(400).json({
         message: 'Missing data',
      })
   }

   try {
      await createEmployee(req.body)
      return res.status(200).json({
         message: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function editEmployeeHandler(req, res) {
   const employeeId = req.params.employeeId
   if (!employeeId) {
      return res.status(400).json({
         code: 'ER',
         meaagse: 'Missing data',
      })
   }

   const employeeInfo = await getEmployeeInfoAndRolesById(employeeId)
   try {
      if (!employeeInfo) {
         return res.status(404).json({
            code: 'NF',
            meaasge: 'Manufacturer not found',
         })
      }
      return res.status(200).json({
         code: 'SS',
         data: employeeInfo,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function updateEmployeeHandler(req, res) {}

async function deleteEmployeeHandler(req, res) {}

module.exports = {
   getAllEmployeeHandler,
   createEmployeeHandler,
   editEmployeeHandler,
   updateEmployeeHandler,
   deleteEmployeeHandler,
}
