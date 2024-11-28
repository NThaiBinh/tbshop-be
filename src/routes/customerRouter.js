const express = require('express')
const upload = require('../middleware/handleFile')
const customerRouter = express.Router()
const {
   getAllCustomerHandler,
   createCustomerHandler,
   getInfoCustomerHandler,
   editCustomerHandler,
   updateCustomerHandler,
   deleteCustomerHandler,
   createCustomerAddressHandler,
   getAllCustomerAddressHandler,
   deleteCustomerAddressHandler,
   updateDefaultCustomerAddressHandler,
} = require('../controllers/customerController')

customerRouter.get('/', getAllCustomerHandler)
customerRouter.post('/create', createCustomerHandler)
customerRouter.get('/address/:customerId', getAllCustomerAddressHandler)
customerRouter.post('/address/create/:customerId', createCustomerAddressHandler)
customerRouter.put('/address/update-default/:addressId', updateDefaultCustomerAddressHandler)
customerRouter.delete('/address/delete/:addressId', deleteCustomerAddressHandler)
customerRouter.get('/info/:customerId', getInfoCustomerHandler)
customerRouter.get('/edit/:customerId', editCustomerHandler)
customerRouter.put('/update/:customerId', upload.single('customerImage'), updateCustomerHandler)
customerRouter.delete('/delete/:customerId', deleteCustomerHandler)

module.exports = customerRouter
