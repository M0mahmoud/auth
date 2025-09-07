"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

interface LoginFormData {
  email: string;
  password: string;
}

type Errors = Partial<Record<keyof LoginFormData, string>>;

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

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
    authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onRequest: () => setIsPending(true),
        onSuccess: (data) => {
          setIsPending(false);
          console.log("Login success:", data);
        },
        onError: (error) => {
          setIsPending(false);
          console.error("Login error:", error);
          setErrors({ password: "Invalid email or password" });
        },
      }
    );
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsPending(true);
    authClient.signIn.social(
      { provider },
      {
        onError: () => setIsPending(false),
        onSuccess: (data) => {
          setIsPending(false);
          console.log(`${provider} login success:`, data);
        },
      }
    );
  };

  const redirectUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect_url") ?? ""
      : "";

  const inputClasses =
    "w-full px-3 py-2 border border-foreground/20 rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 text-foreground">
      <div className="w-full max-w-md bg-background border border-foreground/20 rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
          <p className="text-sm opacity-80 mt-2">
            Welcome back! Please log in to your account
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
                className={inputClasses}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isPending}
                  className={inputClasses + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-foreground/60 hover:text-foreground"
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
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
                "Continue"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 opacity-70">or</span>
            </div>
          </div>

          {/* Google */}
          <button
            onClick={() => {
              setIsPending(true);
              handleSocialLogin("google");
            }}
            disabled={isPending}
            aria-disabled={isPending}
            className="w-full bg-background border border-foreground/20 hover:bg-foreground/5 text-foreground font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center mb-4"
          >
            <Image
              src={"/google.svg"}
              width={16}
              height={16}
              alt="Google logo"
              className="mr-2 h-4 w-4"
            />
            Continue with Google
          </button>

          {/* GitHub */}
          <button
            onClick={() => {
              setIsPending(true);
              handleSocialLogin("github");
            }}
            disabled={isPending}
            aria-disabled={isPending}
            className="w-full bg-background border border-foreground/20 hover:bg-foreground/5 text-foreground font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
          >
            <Image
              src={"/github.svg"}
              width={16}
              height={16}
              alt="GitHub logo"
              className="mr-2 h-4 w-4"
            />
            Continue with GitHub
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-foreground/5 rounded-b-lg flex justify-center">
          <span className="text-sm opacity-80">
            Don’t have an account?{" "}
            <a
              href={
                redirectUrl
                  ? `/auth/signup?redirect_url=${encodeURIComponent(
                      redirectUrl
                    )}`
                  : "/auth/signup"
              }
              className={`text-blue-600 underline hover:text-blue-500 transition-colors duration-200 ${
                isPending ? "pointer-events-none opacity-60" : ""
              }`}
              aria-disabled={isPending}
              tabIndex={isPending ? -1 : 0}
            >
              Sign up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
