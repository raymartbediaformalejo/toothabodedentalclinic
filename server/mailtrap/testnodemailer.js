const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "465",
  secure: true,
  auth: {
    user: "toothabode.online@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

transporter
  .sendMail({
    to: "formalejoraymartbedia@gmail.com",
    subject: "my subject",
    html: "<h1>Hi this is nodemailer tooth abode</h1>",
  })
  .then(() => {
    console.log("emial sent");
  })
  .catch((err) => {
    console.error(err);
  });
