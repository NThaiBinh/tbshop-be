const { getCustomerById } = require('../services/customerServices')
const {
   createInvoice,
   getAllInvoices,
   getAllInvoicesByCustomerId,
   confirmInvoice,
   printInvoice,
   statistical,
   getSearchResults,
} = require('../services/invoiceServices')
const sendMail = require('../services/mailServices')

async function getAllInvoicesHandler(req, res) {
   const { status } = req.query
   const invoices = await getAllInvoices(status)
   try {
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

async function getSearchResultsHandler(req, res) {
   const { q } = req.query
   try {
      const searchResults = await getSearchResults(q)
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
   try {
      await createInvoice(req.body)
      const customerInfo = await getCustomerById(customerId)
      sendMail(
         customerInfo.EMAILKH,
         'ĐẶT HÀNG THÀNH CÔNG',
         `<h1 style=""color:rgb(72, 72, 238); font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;"">Cảm ơn quý khách</h1>
                        <p>Cản ơn quý khách đã tin tưởng sử dụng dịch vụ của chúng tôi. Nếu có gì thắc mắc hoặc góp ý xin vui lòng gửi về Mail
                            <span style=""color:rgb(230, 30, 230)"">nguyenthaibinh838@gmail.com</span>. Chúng tôi rất sẵn lòng tiếp nhận.
                            <br>
                            <br>
                            <br>
                            Xin cảm ơn, <br>
                            TBSHOP
                        </p>`,
      )
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

async function printInvoiceHandler(req, res) {
   const invoiceId = req.params.invoiceId
   try {
      const invoiceInfo = await printInvoice(invoiceId)
      return res.status(200).json({
         code: 'SS',
         data: invoiceInfo,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
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

async function statisticalHandler(req, res) {
   const { startDate, endDate } = req.query
   try {
      const data = await statistical(startDate, endDate)
      return res.status(200).json({
         code: 'SS',
         data,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
         err,
      })
   }
}

module.exports = {
   getAllInvoicesHandler,
   getAllInvoicesByCustomerIdHandler,
   createInvoiceHandler,
   confirmInvoiceHandler,
   printInvoiceHandler,
   statisticalHandler,
   getSearchResultsHandler,
}
