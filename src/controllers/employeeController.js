const { getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployeeInfoById } = require('../services/employeeServices')

async function getAllEmployeeHandler(req, res) {
   try {
      const employees = await getAllEmployees()
      return res.status(200).json({ code: 'SS', data: employees })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         meaasge: 'Server error',
      })
   }
}

async function createEmployeeHandler(req, res) {
   const image = req.file
   const { positionId, name, birdth, address, phoneNumber, email } = req.body
   if (!positionId || !name || !phoneNumber || !email) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   await createEmployee({ image: image.filename, ...req.body })
   try {
      return res.status(200).json({
         code: 'SS',
         message: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
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

   const employeeInfo = await getEmployeeInfoById(employeeId)
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

async function updateEmployeeHandler(req, res) {
   const image = req.file
   const employeeId = req.params.employeeId
   const { positionId, name, birdth, address, phoneNumber, email } = req.body
   if (!positionId || !name || !phoneNumber || !email) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   await updateEmployee({ employeeId, image: image?.filename, ...req.body })
   try {
      return res.status(200).json({
         code: 'SS',
         message: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function deleteEmployeeHandler(req, res) {
   const employeeId = req.params.employeeId
   await deleteEmployee(employeeId)
   try {
      return res.status(200).json({
         code: 'SS',
         message: 'Delete successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

module.exports = {
   getAllEmployeeHandler,
   createEmployeeHandler,
   editEmployeeHandler,
   updateEmployeeHandler,
   deleteEmployeeHandler,
}
