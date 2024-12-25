const { login, register } = require('../services/authServices')

async function registerHandler(req, res) {
   const { name, userName, password, accountType } = req.body
   if (!name || !userName || !password || !accountType) {
      return res.status(400).json({
         code: 'ER',
         message: 'Missing data',
      })
   }
   await register(req.body)
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

async function loginHandler(req, res) {
   const { userName, password } = req.body
   if (!userName || !password) {
      return res.status(400).json({
         message: 'Login failed, missing data',
      })
   }
   try {
      const data = await login(userName, password)
      if (data === undefined) {
         return res.status(401).json({
            code: 'ER',
            message: 'Login failed',
         })
      }
      res.cookie('token', data.token, {
         httpOnly: true, // Bảo vệ khỏi JavaScript truy cập
         secure: true, // Chỉ gửi qua HTTPS (bật khi triển khai)
         sameSite: 'Strict', // Chống CSRF
         maxAge: 24 * 60 * 60 * 1000,
      })
      return res.json({
         code: 'SS',
         data: data.payload,
      })
   } catch (err) {
      return res.status(500).json({
         message: 'Server error',
         err,
      })
   }
}

async function logoutHandler(req, res) {
   res.clearCookie('token', {
      httpOnly: true,
      secure: true, // Phải khớp với thuộc tính của cookie ban đầu
      sameSite: 'Strict',
   })
   res.json({
      code: 'SS',
      message: 'Logged out successfully!',
   })
}
module.exports = {
   registerHandler,
   loginHandler,
   logoutHandler,
}
