const express = require('express')
const invoiceRouter = express.Router()
const {
   getAllInvoicesHandler,
   getAllInvoicesByCustomerIdHandler,
   createInvoiceHandler,
   confirmInvoiceHandler,
} = require('../controllers/invoiceController')

invoiceRouter.get('/:customerId', getAllInvoicesByCustomerIdHandler)
invoiceRouter.get('/', getAllInvoicesHandler)
invoiceRouter.post('/create', createInvoiceHandler)
invoiceRouter.put('/confrim-invoice/:invoiceId', confirmInvoiceHandler)
// invoiceRouter.post('/add-cart-item', addCartItemHandler)
// invoiceRouter.put('/update', updateCartItemHandler)
// invoiceRouter.delete('/delete', deleteCartItemHandler)

module.exports = invoiceRouter
