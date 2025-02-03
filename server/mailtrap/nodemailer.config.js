const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  APPOINTMENT_REMINDER_EMAIL_TEMPLATE,
} = require("./emailTemplates.js");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sender = {
  email: process.env.SENDER_EMAIL,
  name: "Tooth Abode Dental Clinic",
};

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email:`, error);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

const sendVerificationEmail = async (email, verificationToken) => {
  const html = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );
  await sendEmail(
    email,
    "Verify Your Email for Tooth Abode Dental Clinic",
    html
  );
};

const sendAppointmentReminderEmail = async (
  email,
  firstname,
  appointmentDate
) => {
  const html = APPOINTMENT_REMINDER_EMAIL_TEMPLATE.replace(
    "{firstname}",
    firstname
  ).replace("{schedule}", appointmentDate);
  await sendEmail(email, "Appointment Reminder", html);
};

const sendWelcomeEmail = async (email, name) => {
  const html = `<p>Welcome to Tooth Abode Dental Clinic, ${name}!</p>`;
  await sendEmail(email, "Welcome to Tooth Abode Dental Clinic", html);
};

const sendPasswordResetEmail = async (email, resetURL) => {
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
  await sendEmail(email, "Reset your password", html);
};

const sendResetSuccessEmail = async (email) => {
  await sendEmail(
    email,
    "Password Reset Successful",
    PASSWORD_RESET_SUCCESS_TEMPLATE
  );
};

module.exports = {
  sendVerificationEmail,
  sendAppointmentReminderEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
