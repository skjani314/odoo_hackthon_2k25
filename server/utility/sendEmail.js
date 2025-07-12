import 'dotenv/config';
import transporter from '../config/nodemailer'; 


const sendEmail = async (to, subject, text, html) => {
  if (!transporter) {
    console.error('Nodemailer transporter not configured. Cannot send email.');
    return { success: false, message: 'Email service not available.' };
  }
  try {
    await transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    return { success: false, message: 'Failed to send email.' };
  }
};

export default sendEmail;