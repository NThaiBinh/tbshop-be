const { getStoreInfo, updateStoreInfo } = require('../services/storeInfoServices')

async function getStoreInfoHandler(req, res) {
   try {
      const storeInfo = await getStoreInfo()
      return res.status(200).json({
         code: 'SS',
         data: storeInfo,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function updateStoreInfoHandler(req, res) {
   const { name, address, phoneNumber, email } = req.body
   if (!name || !address || !phoneNumber || !email) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   await updateStoreInfo({ image: req.file?.filename || null, ...req.body })
   try {
      return res.status(200).json({
         code: 'SS',
         message: 'Update successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

module.exports = {
   getStoreInfoHandler,
   updateStoreInfoHandler,
}
