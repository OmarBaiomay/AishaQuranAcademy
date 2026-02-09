import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // SSL
  secure: true, 
  auth: {
    user: "support@aishaquran.com",
    pass: "!@#$#%234418890Quran"
  }
});

export const sendRegistrationEmail = async (formData) => {
  const { firstName, email, phone, userType, selectedCourse, startDate } = formData;

  // Create HTML email template
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #16a34a;">New Registration Received</h2>
      <p><strong>Name:</strong> ${firstName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Type:</strong> ${userType}</p>
      <p><strong>Course:</strong> ${selectedCourse?.label || "N/A"}</p>
      <p><strong>Start Date:</strong> ${startDate ? new Date(startDate).toLocaleDateString() : "N/A"}</p>
      <p style="margin-top: 20px; font-size: 0.9rem; color: #555;">This registration came from the website registration form.</p>
    </div>
  `;

  const mailOptions = {
    from: `"Aisha Quran Academy" <support@aishaquran.com>`,
    to: ["baiomayomar@gmail.com", "roshdymostafa952@gmail.com"],
    subject: "📩 New Registration Submitted",
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw err;
  }
};
