import nodemailer from 'nodemailer'

// Create a transporter object with the service and auth details
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Function to send the email with the code
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Password Reset Code',
    text: `Here is your password reset code: ${code}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send email');
  }
};

export default sendVerificationEmail;