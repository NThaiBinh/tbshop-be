const { createInvoice, getAllInvoices, getAllInvoicesByCustomerId, confirmInvoice } = require('../services/invoiceServices')

async function getAllInvoicesHandler(req, res) {
   try {
      const invoices = await getAllInvoices()
      return res.status(200).json({
         code: 'SS',
         data: invoices,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function getAllInvoicesByCustomerIdHandler(req, res) {
   try {
      const invoices = await getAllInvoicesByCustomerId(req.params.customerId)
      return res.status(200).json({
         code: 'SS',
         data: invoices,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function createInvoiceHandler(req, res) {
   const { employeeId, customerId, totalOrderPrice, purchasedInStore, status, orderList } = req.body
   if (!employeeId || !customerId || !totalOrderPrice || !purchasedInStore || !status || orderList.length <= 0) {
      return res.status(400).json({
         code: 'ER',
         mesage: 'Missing data',
      })
   }

   await createInvoice(req.body)
   try {
      return res.status(200).json({
         code: 'SS',
         mesage: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

async function confirmInvoiceHandler(req, res) {
   const invoiceId = req.params.invoiceId
   try {
      await confirmInvoice(invoiceId)
      return res.status(200).json({
         code: 'SS',
         mesage: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

module.exports = { getAllInvoicesHandler, getAllInvoicesByCustomerIdHandler, createInvoiceHandler, confirmInvoiceHandler }
