const { getPositionBtId, getAllPositions, createPosition, updatePosition, deletePosition } = require('../services/positionServices')

async function getAllPositionHandler(req, res) {
   try {
      const positions = await getAllPositions()
      return res.status(200).json({ code: 'SS', data: positions })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

async function createPositionHandler(req, res) {
   const { name } = req.body
   if (!name) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      await createPosition(req.body)
      return res.status(200).json({
         code: 'SS',
         meaasge: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         meaasge: 'Server error',
      })
   }
}

async function editPositionHandler(req, res) {
   const positionId = req.params.positionId
   if (!positionId) {
      return res.status(200).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      const position = await getPositionBtId(positionId)
      if (!position) {
         return res.status(200).json({
            code: 'NF',
            message: 'Position not found',
         })
      }
      return res.status(200).json({
         code: 'SS',
         data: position,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

async function updatePositionHandler(req, res) {
   const positionId = req.params.positionId
   const { name } = req.body
   if (!positionId || !name) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      await updatePosition({ positionId, ...req.body })
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

async function deletePositionHandler(req, res) {
   const positionId = req.params.positionId
   if (!positionId) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      await deletePosition(positionId)
      return res.status(200).json({
         code: 'SS',
         message: 'Delete successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

module.exports = {
   getAllPositionHandler,
   createPositionHandler,
   editPositionHandler,
   updatePositionHandler,
   deletePositionHandler,
}
