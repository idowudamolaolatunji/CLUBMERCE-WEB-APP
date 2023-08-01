const nodemailer = require('nodemailer');

const sendEmail = async function(options) {
    try {
        // create a transporter
        const transporter = nodemailer.createTransport({
            // email service options
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        // define the email options 
        const mailOptions = {
            // sender mail options 
            from: 'info@clubmerce.com',
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // actually send the email
        await transporter.sendMail(mailOptions);

        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow the error to be handled at the calling code
    }
};

module.exports = sendEmail;
