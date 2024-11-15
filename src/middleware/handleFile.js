const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/images')) // Thư mục lưu ảnh
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + Math.random().toString().split('.')[1] + path.extname(file.originalname)) // Đặt tên file với timestamp
   },
})

module.exports = multer({ storage: storage })
