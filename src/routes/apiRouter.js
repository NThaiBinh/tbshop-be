const express = require('express')
const apiRouter = express.Router()
const authentication = require('../middleware/authentication')
const authRouter = require('../routes/authRouter')
const categoryRouter = require('./categoryRouter')
const productTypeRouter = require('./productTypeRouter')
const manufacturerRouter = require('./manufacturerRouter')
const productRouter = require('./productRouter')
const employeesRouter = require('./employeesRouter')
const customerRouter = require('./customerRouter')
const positionRouter = require('./positionRouter')
const storeInfoRouter = require('./storeInfoRouter')
const storewideDiscountRouter = require('./storewideDiscountRouter')
const productDiscountRouter = require('./productDiscountRouter')
const cartRouter = require('./cartRouter')

// apiRouter.use('*', authentication)
apiRouter.use('/auth', authRouter)
apiRouter.use('/categories', categoryRouter)
apiRouter.use('/product-types', productTypeRouter)
apiRouter.use('/positions', positionRouter)
apiRouter.use('/manufacturers', manufacturerRouter)
apiRouter.use('/products', productRouter)
apiRouter.use('/employees', employeesRouter)
apiRouter.use('/customers', customerRouter)
apiRouter.use('/store-info', storeInfoRouter)
apiRouter.use('/storewide-discounts', storewideDiscountRouter)
apiRouter.use('/product-discounts', productDiscountRouter)
apiRouter.use('/carts', cartRouter)

module.exports = apiRouter
