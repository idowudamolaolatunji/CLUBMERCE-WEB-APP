const nodemailer = require('nodemailer');


const sendEmail = async function(options) {
    try {
        // create a transporter
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

         // Add a verify callback to get debugging information
        transporter.verify(function(error, success) {
            if (error) {
                console.log('Transporter verification error:', error);
            } else {
                console.log('Transporter is ready to take messages');
            }
        });

        // define the email options 
        const mailOptions = {
            from: 'info@clubmerce.com',
            to: options.user,
            subject: options.subject,
            // text: options.message,
            html: options.message
        };

        // actually send the email
       const data = await transporter.sendMail(mailOptions);
       console.log('Email sent successfully!', data);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};


module.exports = sendEmail;
