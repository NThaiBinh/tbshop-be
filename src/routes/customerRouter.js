const express = require('express')
const customerRouter = express.Router()
const {
   getAllCustomerHandler,
   createCustomerHandler,
   getInfoCustomerHandler,
   editCustomerHandler,
   updateCustomerHandler,
   deleteCustomerHandler,
   customerRegisterHandler,
} = require('../controllers/customerController')

customerRouter.get('/', getAllCustomerHandler)
customerRouter.post('/create', createCustomerHandler)
customerRouter.get('/info/:customerId', getInfoCustomerHandler)
customerRouter.get('/edit/:customerId', editCustomerHandler)
customerRouter.put('/update/:customerId', updateCustomerHandler)
customerRouter.delete('/delete/:customerId', deleteCustomerHandler)

module.exports = customerRouter
