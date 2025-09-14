// File is now a .tsx
import React from "react";

interface ResetPasswordEmailProps {
  name: string;
  url: string;
}

export const ResetPasswordEmail = ({ name, url }: ResetPasswordEmailProps) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333",
      }}
    >
      <h1 style={{ color: "#0070f3" }}>Password Reset Request</h1>
      <p>Hello {name},</p>
      <p>
        We received a request to reset your password. If you initiated this
        request, please click the button below to reset your password.
      </p>
      <div style={{ margin: "20px 0" }}>
        <a
          href={url}
          style={{
            backgroundColor: "#0070f3",
            color: "#ffffff",
            padding: "10px 20px",
            textDecoration: "none",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          Reset Password
        </a>
      </div>
      <p>If you did not request a password reset, please ignore this email.</p>
    </div>
  );
};
