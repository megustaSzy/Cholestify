import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetEmail = async (to, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Support" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset Password",
    html: `
      <h3>Reset Password</h3>
      <p>Klik link di bawah untuk reset password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Link ini berlaku 5 menit.</p>
    `,
  });
};
