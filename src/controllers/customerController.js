const {
   createCustomer,
   login,
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
   const { name, email, password } = req.body
   if (!name || !email || !password) {
      return res.status(400).json({
         message: 'Missing data',
      })
   }

   const customer = await getCustomerByEmail(email)
   try {
      if (customer && customer.EMAILKH !== email) {
         return res.status(409).json({
            message: 'Customer already exits',
         })
      }

      await createCustomer(req.body)
      return res.status(200).json({
         mesage: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function loginHandler(req, res) {
   const { email, password } = req.body
   if (!email || !password) {
      return res.status(400).json({
         message: 'Login failed, missing data',
      })
   }
   try {
      const data = await login(email, password)
      if (data === undefined) {
         return res.status(401).json({
            message: 'Login failed',
         })
      }
      const date = new Date()
      date.setTime(Date.now() + 1 * 24 * 60 * 60 * 1000)
      return res
         .setHeader('Set-Cookie', `token=${data.token}; expires=${date.toUTCString()}; path=/; HttpOnly`)
         .json(data.payload)
   } catch (err) {
      return res.status(500).json({
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
      return res.status(200).json(customer)
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
   loginHandler,
   getInfoCustomerHandler,
   getAllCustomerHandler,
   editCustomerHandler,
   updateCustomerHandler,
   deleteCustomerHandler,
}
