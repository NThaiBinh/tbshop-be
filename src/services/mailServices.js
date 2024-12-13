const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'nguyenthaibinh838@gmail.com',
      pass: 'dbaj mkpe cvsb fqul',
   },
})

function sendMail(to, subject, html) {
   const mailOptions = {
      from: 'nguyenthaibinh838@gmail.com',
      to: to,
      subject: subject,
      html: html,
   }

   mailOptions.to &&
      transporter.sendMail(mailOptions, (err, info) => {
         console.log(err)
      })
}

module.exports = sendMail
