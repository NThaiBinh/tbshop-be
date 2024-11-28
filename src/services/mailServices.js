const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'nguyenthaibinh838@gmail.com',
      pass: 'dbaj mkpe cvsb fqul',
   },
})

function sendMail(to, subject, text) {
   const mailOptions = {
      from: 'nguyenthaibinh838@gmail.com',
      to: 'penguincute0208@gmail.com',
      subject: 'Alo Alo',
      text: 'ola-ola',
   }

   transporter.sendMail(mailOptions, (err, info) => {
      console.log(err)
   })
}

module.exports = sendMail
