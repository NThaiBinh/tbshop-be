const express = require('express')
const invoiceRouter = express.Router()
const {
   getAllInvoicesHandler,
   getAllInvoicesByCustomerIdHandler,
   createInvoiceHandler,
   confirmInvoiceHandler,
   printInvoiceHandler,
   statisticalHandler,
} = require('../controllers/invoiceController')

invoiceRouter.get('/statistical', statisticalHandler)
invoiceRouter.get('/:customerId', getAllInvoicesByCustomerIdHandler)
invoiceRouter.get('/', getAllInvoicesHandler)
invoiceRouter.put('/confrim-invoice/:invoiceId', confirmInvoiceHandler)
invoiceRouter.post('/create', createInvoiceHandler)
invoiceRouter.get('/print/:invoiceId', printInvoiceHandler)

module.exports = invoiceRouter
