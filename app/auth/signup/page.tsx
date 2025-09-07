"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type Errors = Partial<Record<keyof FormData, string>>;

export default function SignUp() {
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

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
    authClient.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      },
      {
        onRequest: () => {
          setIsPending(true);
        },
        onSuccess: (data) => {
          setIsPending(false);
          console.log("User signed up:", data);
        },
        onError: (error) => {
          setIsPending(false);
          console.error("Sign up error:", error);
        },
      }
    );
  };

  const redirectUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect_url")
      : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 text-foreground">
      <div className="w-full max-w-md bg-background border border-foreground/20 rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Sign up</h2>
          <p className="text-sm opacity-80 mt-2">
            Create a new account to get started
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-3 py-2 border border-foreground/20 rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

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
                className="w-full px-3 py-2 border border-foreground/20 rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-3 py-2 border border-foreground/20 rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-1">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-3 py-2 border border-foreground/20 rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
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

          {/* GitHub button */}
          <button
            onClick={() => {
              setIsPending(true);
              authClient.signIn.social(
                {
                  provider: "google",
                },
                {
                  onError: () => setIsPending(false),
                  onSuccess: () => setIsPending(false),
                }
              );
            }}
            disabled={isPending}
            aria-disabled={isPending}
            className="w-full bg-background border border-foreground/20 hover:bg-foreground/5 text-foreground font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center cursor-pointer mb-4"
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
          <button
            onClick={() => {
              setIsPending(true);
              authClient.signIn.social(
                {
                  provider: "github",
                },
                {
                  onError: () => setIsPending(false),
                  onSuccess: () => setIsPending(false),
                }
              );
            }}
            disabled={isPending}
            aria-disabled={isPending}
            className="w-full bg-background border border-foreground/20 hover:bg-foreground/5 text-foreground font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center cursor-pointer"
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
            Already have an account?{" "}
            <a
              href={
                redirectUrl
                  ? `/auth/signin?redirect_url=${encodeURIComponent(
                      redirectUrl
                    )}`
                  : "/auth/signin"
              }
              className={`text-blue-600 underline hover:text-blue-500 transition-colors duration-200 ${
                isPending ? "pointer-events-none opacity-60" : ""
              }`}
              aria-disabled={isPending}
              tabIndex={isPending ? -1 : 0}
            >
              Sign in
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
