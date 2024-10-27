require('dotenv').config()
const jwt = require('jsonwebtoken')
function authentication(req, res, next) {
   const whiteLists = ['customers/login', 'customers/register', 'categories', 'products']
   if (whiteLists.find((item) => '/api/v1/' + item === req.originalUrl)) {
      next()
   } else {
      const token = req.cookies.token
      if (token) {
         const decoded = jwt.verify(token, process.env.JWT_SECRET)
         if (decoded) {
            next()
         } else {
            return res.status(401).json({
               message: 'Unauthorized',
            })
         }
      } else {
         return res.status(401).json({
            message: 'Unauthorized',
         })
      }
   }
}

module.exports = authentication
