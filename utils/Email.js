const nodemailer = require('nodemailer');

const sendEmail = async function(option) {
    // create a transporter
    const transporter = nodemailer.createTransporter({
        // email service options
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    })

    // define the email options 
    const mailOptions = {
        // sender mail options 
        from: '<hello@clubmerce.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    // actually send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;