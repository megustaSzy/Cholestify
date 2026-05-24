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
    from: process.env.SMTP_FROM,
    to,
    subject: "Reset Password - Cholestify",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; background-color: #ffffff;">
        <h2 style="color: #1d4ed8; margin-bottom: 20px;">Cholestify</h2>
        <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 15px;">Permintaan Reset Password</h3>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
          Kami menerima permintaan untuk mereset password akun Anda. Silakan klik tombol di bawah ini untuk membuat password baru:
        </p>
        
        <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
          Reset Password Saya
        </a>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; margin-bottom: 5px;">
          Tombol ini hanya berlaku selama <strong>5 menit</strong>.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 0;">
          Jika Anda tidak merasa meminta reset password, silakan abaikan email ini dengan aman.
        </p>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Cholestify Team. All rights reserved.
        </p>
      </div>
    `,
  });
};
