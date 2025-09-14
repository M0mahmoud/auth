"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

interface FormData {
  email: string;
}

type Errors = Partial<Record<keyof FormData, string>>;

export default function ForgotPassword() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsPending(true);
    authClient.forgetPassword(
      {
        email: formData.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      },
      {
        onRequest: () => setIsPending(true),
        onSuccess: (data) => {
          setIsPending(false);
          setIsSuccess(true);
          console.log("Password reset email sent:", data);
        },
        onError: (error) => {
          setIsPending(false);
          console.error("Password reset error:", error);
          setErrors({ email: "Failed to send reset email. Please try again." });
        },
      }
    );
  };

  const inputClasses =
    "w-full px-3 py-2 border border-foreground/20 rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50";

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background p-4 text-foreground">
        <div className="w-full max-w-md bg-background border border-foreground/20 rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 pb-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Check your email
            </h2>
            <p className="text-sm opacity-80 mt-2">
              We&apos;ve sent a password reset link to {formData.email}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                If you don&apos;t see the email, check your spam folder or try
                again.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ email: "" });
                }}
                className="w-full bg-background border border-foreground/20 hover:bg-foreground/5 text-foreground font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Try Different Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background p-4 text-foreground">
      <div className="w-full max-w-md bg-background border border-foreground/20 rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Forgot Password
          </h2>
          <p className="text-sm opacity-80 mt-2">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isPending}
                placeholder="Enter your email address"
                className={inputClasses}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-foreground/5 rounded-b-lg flex justify-center">
          <span className="text-sm opacity-80">
            Remember your password?{" "}
            <Link
              href="/auth/signin"
              className={`text-blue-600 underline hover:text-blue-500 transition-colors duration-200 ${
                isPending ? "pointer-events-none opacity-60" : ""
              }`}
              aria-disabled={isPending}
              tabIndex={isPending ? -1 : 0}
            >
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
