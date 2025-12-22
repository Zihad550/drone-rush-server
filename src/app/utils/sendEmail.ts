import path from "node:path";
import ejs, { type Data } from "ejs";
import nodemailer from "nodemailer";
import env from "../../env";

const transporter = nodemailer.createTransport({
  secure: true,
  auth: {
    user: env.EMAIL_SENDER.SMTP_USER,
    pass: env.EMAIL_SENDER.SMTP_PASS,
  },
  port: Number(env.EMAIL_SENDER.SMTP_PORT),
  host: env.EMAIL_SENDER.SMTP_HOST,
});

interface SendEmailOptions {
  to: string;
  subject: string;
  template_name: string;
  template_data?: Data;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const send_email = async ({
  to,
  subject,
  template_name,
  template_data,
  attachments,
}: SendEmailOptions) => {
  try {
    const template_path = path.join(
      __dirname,
      `templates/${template_name}.ejs`,
    );
    const html = await ejs.renderFile(template_path, template_data);
    await transporter.sendMail({
      from: env.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
  } catch (_error) {
    console.log("failed to send email");
  }
};
