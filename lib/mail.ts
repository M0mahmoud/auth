import nodemailer from "nodemailer";

import React from "react";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Changed to false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  content: React.ReactElement;
}

export const sendEmail = async ({ to, subject, content }: SendEmailOptions) => {
  try {
    // Import renderToStaticMarkup dynamically to avoid client-side bundling issues
    const { renderToStaticMarkup } = await import("react-dom/server");

    // Render the React component to a static HTML string
    const htmlContent = renderToStaticMarkup(content);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to} with subject: ${subject}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    // You can customize the error handling further, for example,
    // by using a logging service like Sentry.
  }
};
