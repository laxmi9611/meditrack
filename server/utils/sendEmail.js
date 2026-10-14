const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      process.env.EMAIL_PASS === "your_app_password_no_spaces"
    ) {
      console.log("⚠️  Email not configured, skipping:", subject);
      return;
    }

    await transporter.sendMail({
      from: `"MediTrack" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error(`❌ Email error: ${err.message}`);
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: "Welcome to MediTrack! 🏥",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h1 style="color: #0d9488;">Welcome to MediTrack, ${name}!</h1>
        <p>Thank you for joining our healthcare platform.</p>
        <p>You can now book appointments, chat with doctors, and access your medical records.</p>
        <a href="${process.env.CLIENT_URL}" style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">Get Started</a>
      </div>
    `,
  }),

  appointmentBooked: (patientName, doctorName, date, time) => ({
    subject: "Appointment Confirmed - MediTrack",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #0d9488;">Appointment Booked ✅</h2>
        <p>Hi ${patientName},</p>
        <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been scheduled.</p>
        <div style="background: #f0fdfa; padding: 15px; border-left: 4px solid #0d9488; margin: 20px 0;">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>
        <p>We'll send you a reminder before the appointment.</p>
      </div>
    `,
  }),

  appointmentStatus: (patientName, doctorName, status) => ({
    subject: `Appointment ${status} - MediTrack`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #0d9488;">Appointment ${status}</h2>
        <p>Hi ${patientName},</p>
        <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been <strong>${status.toLowerCase()}</strong>.</p>
      </div>
    `,
  }),

  prescriptionReady: (patientName, doctorName) => ({
    subject: "Prescription Ready - MediTrack",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #0d9488;">Prescription Ready 💊</h2>
        <p>Hi ${patientName},</p>
        <p>Dr. ${doctorName} has written a prescription for you.</p>
        <p>Log in to MediTrack to view and download it.</p>
        <a href="${process.env.CLIENT_URL}" style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">View Prescription</a>
      </div>
    `,
  }),

  doctorVerified: (doctorName) => ({
    subject: "Account Verified - MediTrack 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #0d9488;">Congratulations Dr. ${doctorName}!</h2>
        <p>Your doctor account has been verified by our admin team.</p>
        <p>You can now receive appointments from patients.</p>
        <a href="${process.env.CLIENT_URL}" style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">Go to Dashboard</a>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };