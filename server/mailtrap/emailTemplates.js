const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #C97E00, #EAB308); padding: 20px; text-align: center;">
      <img src="https://res.cloudinary.com/deklgilr5/image/upload/v1735207732/p8oxehzmkoqw5rcjptlo.png"/>
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up with <span style="color: #C97E00; font-weight: bold;">Tooth Abode Dental Clini</span>c! We’re excited to have you on board.</p>
    <p>Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #C97E00;">{verificationCode}</span>
    </div>
    <p>Please enter this code on the <a href="http://localhost:5173/verify-email">verification page</a> to complete your registration.</p>
    <p>This code will expire in <span style="font-weight: bold;">15 minutes</span> for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p style="margin-top: 3rem;">Best regards,</p>
    <p>The Tooth Abode Dental Clinic Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const APPOINTMENT_REMINDER_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reminder: Your Upcoming Dental Appointment at Tooth Abode Dental Clinic</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #C97E00, #EAB308); padding: 20px; text-align: center;">
      <img src="https://res.cloudinary.com/deklgilr5/image/upload/v1735207732/p8oxehzmkoqw5rcjptlo.png"/>
    <h1 style="color: white; margin: 0; font-size: 16px;">Remider: Your Upcoming Dental Appointment</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear <span>{firstname}</span>,</p>
    <p>This is a friendly reminder that you have a dental appointment scheduled at <span style="color: #C97E00; font-weight: bold;">Tooth Abode Dental Clinic</span>.</p>
    <div style="font-size: 14px; border: 1px solid hsl(31.8, 81%, 28.8%); border-radius: 4px; padding-left: 10px; border-style: dashed; margin-top: 2rem; margin-bottom: 2rem; background-color: hsl(54.5 91.7% 95.3%)">
     <p style="margin-top: -13px;">🕒 Schedule: <span style="font-weight:600">{schedule}</span></p>
      <p style="margin-top: -13px;">📍 Location: <span style="font-weight:600">Juan Luna St 1806, Manila, Philippines, 1012</span></p>
    </div>
    
    <p>Please arrive 10 minutes early to ensure a smooth check-in process. If you need to reschedule or have any questions, feel free to contact us at 09159919558 or reply to this email.</p>
   
    <p>We look forward to seeing you and helping you maintain a healthy smile! 😁</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p style="margin-top: 3rem;">Best regards,</p>
    <p>The Tooth Abode Dental Clinic Team</p>
    <p>📞 <span style="">0915 991 9558</span>
</p>
<p  style="margin-top:-16px;">📧 <span>toothabode.online@gmail.com</span>
</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

module.exports = {
  VERIFICATION_EMAIL_TEMPLATE,
  APPOINTMENT_REMINDER_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
};
