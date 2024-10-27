const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')

function serverConfigs(app) {
   app.use(express.static(path.join(__dirname, '../public')))
   app.use(cookieParser())
   app.use(
      cors({
         origin: 'http://localhost:3000',
         credentials: true,
      }),
   )
   app.use(express.json())
   app.use(express.urlencoded({ extended: true }))
}

module.exports = {
   serverConfigs,
}
