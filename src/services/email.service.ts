import nodemailer from "nodemailer";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true if 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial; max-width: 600px;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password.</p>
          <p>Click the button below to reset it:</p>
          <a href="${resetLink}" 
             style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:5px;">
             Reset Password
          </a>
          <p>This link will expire in 15 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
  }
}

export default new EmailService();
