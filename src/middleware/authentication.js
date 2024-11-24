require('dotenv').config()
const jwt = require('jsonwebtoken')
const { pathToRegexp } = require('path-to-regexp')

function checkWhiteLists(url) {
   const whiteLists = ['customers/login', 'customers/register', 'products', 'products/edit/:productId']
   return whiteLists.find((item) => {
      const regex = pathToRegexp('/api/v1/' + item)
      return regex.regexp.test(url)
   })
}

function authentication(req, res, next) {
   if (checkWhiteLists(req.baseUrl)) {
      next()
   } else {
      const token = req.cookies.token
      if (token) {
         const decoded = jwt.verify(token, process.env.JWT_SECRET)
         if (decoded) {
            req.user = decoded
            next()
         } else {
            return res.status(401).json({
               code: 'UN',
               message: 'Unauthorized',
            })
         }
      } else {
         return res.status(401).json({
            code: 'UN',
            message: 'Unauthorized',
         })
      }
   }
}

module.exports = authentication
