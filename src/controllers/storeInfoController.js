const { getStoreInfo, updateStoreInfo } = require('../services/storeInfoServices')

async function getStoreInfoHandler(req, res) {
   try {
      const storeInfo = await getStoreInfo()
      return res.status(200).json(storeInfo)
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function updateStoreInfoHandler(req, res) {
   const { name, address, phoneNumber, email } = req.body
   if (!name || !address || !phoneNumber || !email) {
      return res.status(400).json({
         message: 'Missing data',
      })
   }

   await updateStoreInfo(req.body)
   try {
      return res.status(500).json({
         message: 'Update successfully',
      })
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

module.exports = {
   getStoreInfoHandler,
   updateStoreInfoHandler,
}
