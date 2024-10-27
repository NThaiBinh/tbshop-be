const sql = require('mssql')
const connectionPool = require('../config/dbConfig')
const {
   getManufacById,
   getManufacByEmail,
   getAllManufacs,
   createManufac,
   updateManufac,
   deleteManufac,
} = require('../models/manufacturers')

async function getAllManufacHandler(req, res) {
   try {
      const page = req.query.page
      const manufacs = await getAllManufacs(page)
      return res.status(200).json(manufacs)
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function createManufacHandler(req, res) {
   const { name, address, phoneNumber, email } = req.body
   if (!name || !address || !phoneNumber || !email) {
      return res.status(400).json({
         message: 'Missing data',
      })
   }

   try {
      const customer = await getManufacByEmail(email)
      if (customer && customer.EMAILKH !== email) {
         return res.status(409).json({
            message: 'Manufac already exits',
         })
      }

      await createManufac(req.body)
      return res.status(200).json({
         mesage: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function editManufacHandler(req, res) {
   const manufacId = req.params.manufacId
   if (!manufacId) {
      return res.status(400).json({
         meaagse: 'Missing data',
      })
   }

   try {
      const manufac = await getManufacById(manufacId)
      if (!manufac) {
         return res.status(200).json({
            meaasge: 'Manufacturer not found',
         })
      }
      return res.status(200).json(manufac)
   } catch (err) {
      return res.status(200).json({
         message: 'Server error',
         err,
      })
   }
}

async function updateManufacHandler(req, res) {
   const manufacId = req.params.manufacId
   const { name, address, phoneNumber, email } = req.body
   if ((!manufacId, !name || !address || !phoneNumber || !email)) {
      return res.status(400).json({
         meaagse: 'Missing data',
      })
   }

   try {
      const customer = await getManufacByEmail(email)
      if (customer && customer.EMAILNSX !== email) {
         return res.status(409).json({
            message: 'Manufac already exits',
         })
      }

      await updateManufac({ manufacId, ...req.body })
      return res.status(200).json({
         meaasge: 'Update successfully',
      })
   } catch (err) {
      return res.status(200).json({
         message: 'Server error',
         err,
      })
   }
}

async function deleteManufacHandler(req, res) {
   const manufacId = req.params.manufacId
   if (!manufacId) {
      return res.status(400).json({
         meaagse: 'Missing data',
      })
   }
   try {
      await deleteManufac(manufacId)
      return res.status(200).json({
         meaasge: 'Delete successfully',
      })
   } catch (err) {
      return res.status(200).json({
         message: 'Server error',
         err,
      })
   }
}

module.exports = {
   getAllManufacHandler,
   createManufacHandler,
   editManufacHandler,
   updateManufacHandler,
   deleteManufacHandler,
}
