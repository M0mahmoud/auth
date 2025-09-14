import React from "react";

interface ResetPasswordEmailProps {
  name: string;
  url: string;
}

export const VerificationEmail = ({ name, url }: ResetPasswordEmailProps) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            color: "#333333",
            fontSize: "24px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Verify Your Email Address
        </h1>

        <p style={{ color: "#666666", fontSize: "16px", lineHeight: "1.5" }}>
          {name ? `Hi ${name},` : "Hello,"}
        </p>

        <p style={{ color: "#666666", fontSize: "16px", lineHeight: "1.5" }}>
          Thank you for signing up! To complete your registration and secure
          your account, please verify your email address by clicking the button
          below.
        </p>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={url}
            style={{
              backgroundColor: "#007bff",
              color: "#ffffff",
              padding: "12px 30px",
              textDecoration: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Verify Email Address
          </a>
        </div>

        <p style={{ color: "#666666", fontSize: "14px", lineHeight: "1.5" }}>
          If the button doesn't work, you can also copy and paste this link into
          your browser:
        </p>

        <p
          style={{
            color: "#007bff",
            fontSize: "14px",
            wordBreak: "break-all",
            backgroundColor: "#f8f9fa",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {url}
        </p>

        <p style={{ color: "#999999", fontSize: "12px", marginTop: "30px" }}>
          This verification link will expire in 24 hours. If you didn't create
          an account, you can safely ignore this email.
        </p>
      </div>
    </div>
  );
};
