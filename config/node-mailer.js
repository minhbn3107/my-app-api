const nodemailer = require("nodemailer");

const user = process.env.EMAIL;
const pass = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user,
        pass,
    },
});

const sendVerificationEmail = async (email, token) => {
    await transporter.sendMail({
        from: "Music App <onboarding@musicapp.dev>",
        to: email,
        subject: "Reset Password",
        html: `<p>Your token is ${token}</p>`,
    });
};

module.exports = {
    sendVerificationEmail,
};
