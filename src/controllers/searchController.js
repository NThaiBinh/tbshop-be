const { searchProducts } = require('../services/searchServices')

async function searchProductsHandler(req, res) {
   const searchValue = req.query.key
   try {
      const searchResults = await searchProducts(searchValue)
      return res.status(200).json({
         code: 'SS',
         data: searchResults,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

module.exports = { searchProductsHandler }
