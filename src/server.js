require('dotenv').config()
const express = require('express')
const app = express()
const apiRouters = require('./routes/apiRouter')
const {
   serverConfigs,
   checkAdminAccount,
   checkAccessPermissions,
   checkCategories,
   checkStoreInfo,
} = require('../src/config/serverConfig')

const host = process.env.SERVER_HOST
const port = process.env.SERVER_PORT || 3001

//config server
serverConfigs(app)

//Check default value
checkCategories()
checkAccessPermissions()
checkAdminAccount()
checkStoreInfo()

app.use('/api/v1', apiRouters)

app.listen(port, host, () => {
   console.log(`Server is running on ${port}`)
})
