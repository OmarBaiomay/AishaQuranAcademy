import nodemailer from "nodemailer";

export const sendResetEmail = async (to, resetLink) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",  // ✅ Hostinger SMTP server
    port: 465,                   // Use 465 for secure SSL, or 587 for TLS
    secure: true,                // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER, // e.g. support@yourdomain.com
      pass: process.env.EMAIL_PASS, // your email password or app password
    },
  });

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};
