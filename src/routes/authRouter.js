const express = require('express')
const authRouter = express.Router()

const { loginHandler, registerHandler, logoutHandler } = require('../controllers/authController')

authRouter.post('/register', registerHandler)
authRouter.post('/login', loginHandler)
authRouter.post('/logout', logoutHandler)

module.exports = authRouter
