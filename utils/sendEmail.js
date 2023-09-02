const nodemailer = require("nodemailer");
const { SMPT_MAIL, SMPT_HOST, SMPT_PORT, SMPT_SERVICE, SMPT_PASSWORD } = require("../config");

// Create a transporter
const transporter = nodemailer.createTransport({
    host: SMPT_HOST,
    port: SMPT_PORT,
    service: SMPT_SERVICE,
    auth: {
        user: SMPT_MAIL,
        pass: SMPT_PASSWORD,
    },
});

// Function to send an email
const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: { name: "ScoreRoster", address: SMPT_MAIL },
            to,
            subject,
            html,
        });
        // console.log('Email sent successfully');
    } catch (error) {
        console.error("Error sending email:", error);
        return Promise.reject("Please provide a valid email address.");
    }
};

module.exports = sendEmail;
