const {
   createCustomer,
   getCustomerById,
   getCustomerByEmail,
   getAllCustomers,
   updateCustomer,
   deleteCustomer,
   createCustomerAddress,
   getAllCustomerAddress,
   deleteCustomerAddress,
   updateDefaultCustomerAddress,
} = require('../services/customerServices')

async function getAllCustomerHandler(req, res) {
   try {
      const page = req.query.page
      const customers = await getAllCustomers(page)
      return res.status(200).json({
         code: 'SS',
         data: customers,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

async function createCustomerHandler(req, res) {
   const { accountId, name, image, birth, phoneNumber, email } = customerInfo
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
         code: 'ER',
         message: 'Missing data',
      })
   }
   const customerInfo = await getCustomerById(customerId)
   try {
      if (!customerInfo) {
         return res.status(200).json({
            code: 'ER',
            message: 'Customer not found!',
         })
      }
      return res.status(200).json(customerInfo)
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

async function editCustomerHandler(req, res) {
   const customerId = req.params.customerId
   if (!customerId) {
      return res.status(400).json({
         coder: 'ER',
         message: 'Missing data',
      })
   }

   try {
      const customer = await getCustomerById(customerId)
      if (!customer) {
         return res.status(200).json({
            code: 'NF',
            message: 'Customer not found',
         })
      }
      return res.status(200).json({
         code: 'SS',
         data: customer,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

async function updateCustomerHandler(req, res) {
   const customerId = req.params.customerId
   const { name, email } = req.body
   if (!customerId || !name) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   const customer = await getCustomerByEmail(email)
   if (customer && customer.MAKH !== customerId) {
      return res.status(409).json({
         code: 'EX',
         message: 'Email already exits',
      })
   }
   await updateCustomer({
      customerId,
      customerImage: req.body.image ? req.body.image : req.file?.filename,
      ...req.body,
   })
   try {
      return res.status(200).json({
         code: 'SS',
         message: 'Update successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

async function deleteCustomerHandler(req, res) {
   const customerId = req.params.customerId
   if (!customerId) {
      return res.status(400).json({
         code: 'ER',
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
      })
   }
}

async function createCustomerAddressHandler(req, res) {
   const customerId = req.params.customerId
   const { address } = req.body
   if (!address) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }

   try {
      await createCustomerAddress(customerId, address)
      return res.status(200).json({
         code: 'SS',
         mesage: 'Create successfully',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

async function getAllCustomerAddressHandler(req, res) {
   const customerId = req.params.customerId
   try {
      const customerAddress = await getAllCustomerAddress(customerId)
      return res.status(200).json({
         code: 'SS',
         data: customerAddress,
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

async function updateDefaultCustomerAddressHandler(req, res) {
   const addressId = req.params.addressId
   try {
      await updateDefaultCustomerAddress(addressId)
      return res.status(200).json({
         code: 'SS',
         data: 'Update successfully!',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
      })
   }
}

async function deleteCustomerAddressHandler(req, res) {
   const addressId = req.params.addressId
   try {
      await deleteCustomerAddress(addressId)
      return res.status(200).json({
         code: 'SS',
         message: 'Delete successfully!',
      })
   } catch (err) {
      return res.status(500).json({
         code: 'ER',
         message: 'Server error',
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
   createCustomerAddressHandler,
   getAllCustomerAddressHandler,
   updateDefaultCustomerAddressHandler,
   deleteCustomerAddressHandler,
}
