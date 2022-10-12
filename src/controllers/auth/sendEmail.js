const nodemailer = require("nodemailer");
require('dotenv').config;


const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({

            host: process.env.nodemailer_host,
            secure: false,
            port: process.env.nodemailerPort,
            auth: {
                user: process.env.nodemailerEmail,
                pass: process.env.nodemailerPass,
            },
        });

        await transporter.sendMail({
            from: process.env.nodemailerEmail,
            to: email,
            subject: subject,
            html: text,
        });

    } catch (error) {

        console.log(error);
    }
};

module.exports = sendEmail;