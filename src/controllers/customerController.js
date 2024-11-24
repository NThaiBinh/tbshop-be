const {
   createCustomer,
   getCustomerById,
   getCustomerByEmail,
   getAllCustomers,
   updateCustomer,
   deleteCustomer,
} = require('../services/customerServices')

async function getAllCustomerHandler(req, res) {
   try {
      const page = req.query.page
      const customers = await getAllCustomers(page)
      return res.status(200).json(customers)
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function createCustomerHandler(req, res) {
   const { accountId, name, image, birth, address, phoneNumber, email } = customerInfo
   if (!name) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      await createCustomer(req.body)
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

async function getInfoCustomerHandler(req, res) {
   const customerId = req.params.customerId
   if (!customerId) {
      return res.status(400).json({
         message: 'Missing data',
      })
   }
   const customerInfo = await getCustomerById(customerId)
   try {
      if (!customerInfo) {
         return res.status(200).json({
            message: 'Customer not found!',
         })
      }
      return res.status(200).json(customerInfo)
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function editCustomerHandler(req, res) {
   const customerId = req.params.customerId
   if (!customerId) {
      return res.status(400).json({
         message: 'Missing data',
      })
   }

   try {
      const customer = await getCustomerById(customerId)
      if (!customer) {
         return res.status(200).json({
            message: 'Customer not found',
         })
      }
      return res.status(200).json({
         code: 'SS',
         data: customer,
      })
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function updateCustomerHandler(req, res) {
   const customerId = req.params.customerId
   const { name, email } = req.body
   if (!customerId || !name || !email) {
      return res.status(400).json({
         message: 'Missing dataaa',
      })
   }

   try {
      const customer = await getCustomerByEmail(email)
      if (customer && customer.MAKH !== customerId) {
         return res.status(409).json({
            message: 'Email already exits',
         })
      }

      await updateCustomer({ customerId, ...req.body })
      return res.status(200).json({
         message: 'Update successfully',
      })
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function deleteCustomerHandler(req, res) {
   const customerId = req.params.customerId
   if (!customerId) {
      return res.status(400).json({
         message: 'Missing data',
      })
   }

   try {
      await deleteCustomer(customerId)
      return res.status(200).json({
         messsage: 'Delete successfully',
      })
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

module.exports = {
   createCustomerHandler,
   getInfoCustomerHandler,
   getAllCustomerHandler,
   editCustomerHandler,
   updateCustomerHandler,
   deleteCustomerHandler,
}
