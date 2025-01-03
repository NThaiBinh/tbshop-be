const sql = require('mssql')
const connectionPool = require('../config/dbConfig')

const {
   getManufacById,
   getManufacByEmail,
   getAllManufacs,
   createManufac,
   updateManufac,
   deleteManufac,
   getAllManufacsByCategoryId,
} = require('../services/manufacturerServices')

async function getAllManufacsHandler(req, res) {
   try {
      const manufacs = await getAllManufacs()
      return res.status(200).json({
         code: 'SS',
         data: manufacs,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function getAllManufacsByCategoryIdHandler(req, res) {
   const categoryId = req.params.categoryId
   try {
      const manufacs = await getAllManufacsByCategoryId(categoryId)
      return res.status(200).json({
         code: 'SS',
         data: manufacs,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function createManufacHandler(req, res) {
   const { name, address, phoneNumber, email } = req.body
   if (!name || !address || !phoneNumber || !email) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      const customer = await getManufacByEmail(email)
      if (customer) {
         return res.status(409).json({
            code: 'EX',
            message: 'Manufac already exits',
         })
      }

      await createManufac({ ...req.body, fileName: req.file.filename })
      return res.status(200).json({
         code: 'SS',
         mesage: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function editManufacHandler(req, res) {
   const manufacId = req.params.manufacId
   if (!manufacId) {
      return res.status(400).json({
         code: 'ER',
         meaagse: 'Missing data',
      })
   }

   try {
      const manufac = await getManufacById(manufacId)
      if (!manufac) {
         return res.status(404).json({
            code: 'NF',
            meaasge: 'Manufacturer not found',
         })
      }
      return res.status(200).json({
         code: 'SS',
         data: manufac,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
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
         code: 'ER',
         meaagse: 'Missing data',
      })
   }

   const customer = await getManufacByEmail(email)
   if (customer && customer.EMAILNSX !== email) {
      return res.status(409).json({
         code: 'EX',
         message: 'Manufac already exits',
      })
   }

   await updateManufac({ manufacId, ...req.body, image: req.body.image ? req.body.image : req.file?.filename })
   try {
      return res.status(200).json({
         code: 'SS',
         meaasge: 'Update successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function deleteManufacHandler(req, res) {
   const manufacId = req.params.manufacId
   if (!manufacId) {
      return res.status(400).json({
         code: 'ER',
         meaagse: 'Missing data',
      })
   }
   try {
      await deleteManufac(manufacId)
      return res.status(200).json({
         code: 'SS',
         meaasge: 'Delete successfully',
      })
   } catch (err) {
      return res.status(200).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

module.exports = {
   getAllManufacsHandler,
   getAllManufacsByCategoryIdHandler,
   createManufacHandler,
   editManufacHandler,
   updateManufacHandler,
   deleteManufacHandler,
}
