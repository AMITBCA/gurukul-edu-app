const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    if (!process.env.SMTP_EMAIL || process.env.SMTP_EMAIL === 'your_email@gmail.com' || process.env.SMTP_EMAIL === '') {
        console.log('\n\n⚠️ SMTP Config Missing: Cannot send real email');
        throw new Error('Real Email setup is required. Please ask admin to configure SMTP in the backend .env file.');
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Define the email options
    const message = {
        from: `${process.env.FROM_NAME || 'Gurukul Excellence'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html // Optional HTML support
    };

    // Send the email
    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
