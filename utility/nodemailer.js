require('dotenv').config();
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports.sendMail = async function sendMail(str,data) {
    //data -> object{name/resetPasswordLink , email}
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  let Osubject,Otext,Ohtml;
  if(str == "signup"){
    Osubject = `Thank You for Signing, ${data.name}`;
    Ohtml = `
    <h1>Welocme to foodApp.com</h1>
    Hope you have agood time !
    Here are your details - 
    Name - ${data.name}
    Email - ${data.email}
    `
  } else if(str == "resetPassword") {
    Osubject = `Reset Password`;
    Ohtml = `
    <h1>foodApp.com</h1>
    Here is your to reset your password : 
    ${data.resetPasswordLink}
    `
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"FoodApp 🍕" <${process.env.MAIL_ID}>`, // sender address
    to: data.email, // list of receivers
    subject: Osubject, // Subject line
    // text: "Hello world?", // plain text body
    html: Ohtml, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

// main().catch(console.error);
