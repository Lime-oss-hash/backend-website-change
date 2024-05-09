import { createTransport } from "nodemailer";
import env from "../util/validateEnv";

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "altjskk010@gmail.com",
        pass: env.SMTP_PASSWORD,
    },
});

export async function sendVerificationCode(
    toEmail: string,
    verificationCode: string) {
    await transporter.sendMail({
        from: "noreplay@altjs.com",
        to: toEmail,
        subject: "Your Verification Code",
        html: `<p>A password reset request has been sent for this account.
        Use this verification code to reset your password.
        It will expire in 10 minutes.</p><p><strong>${verificationCode}</strong></p>
        If you didn't request a password reset, ignore this email.`
        })
}