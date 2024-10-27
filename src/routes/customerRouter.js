const express = require('express')
const customerRouter = express.Router()
const {
   getAllCustomerHandler,
   createCustomerHandler,
   loginHandler,
   getInfoCustomerHandler,
   editCustomerHandler,
   updateCustomerHandler,
   deleteCustomerHandler,
} = require('../controllers/CustomerController')

customerRouter.get('/', getAllCustomerHandler)
customerRouter.post('/register', createCustomerHandler)
customerRouter.post('/login', loginHandler)
customerRouter.get('/info/:customerId', getInfoCustomerHandler)
customerRouter.get('/edit/:customerId', editCustomerHandler)
customerRouter.put('/update/:customerId', updateCustomerHandler)
customerRouter.delete('/delete/:customerId', deleteCustomerHandler)

module.exports = customerRouter
