/* eslint-disable no-console */
import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();
const { NODE_ENV, SENDGRID_API_KEY } = process.env;

const mailSender = async (mailData) => {
  try {
    if (NODE_ENV === "test" || NODE_ENV === "development") {
      const transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.email",
        port: 587,
        secure: false,
        auth: { user: "apikey", pass: SENDGRID_API_KEY },
      });

      const data = {
        from: "employee@airlinepros.net",
        to: mailData.emailTo,
        subject: mailData.subject,
        html: mailData.message,
      };
      const info = await transporter.sendMail(data);
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.log(error, "Mail Error");
  }
};

export default { mailSender };
