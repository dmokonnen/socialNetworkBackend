const nodemailer = require("nodemailer");



module.exports = async (req, res, next) => {
    url = `http://localhost:4200/confirmation/${req.header.token}`;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'hhamza@miu.edu', // generated ethereal user
        pass: '**********'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <hhamza@miu.edu>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Dagu email confirmation', // Subject line
      html: `Please click this link to confirm your email: 
               <a href="${url}">${url}</a> ` // plain text body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      //res.render('contact', {msg:'Email has been sent'});
  });
}               