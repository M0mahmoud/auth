"use client";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  Suspense,
} from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface FormData {
  password: string;
  confirmPassword: string;
}

type Errors = Partial<Record<keyof FormData, string>>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      // Redirect to forgot password if no token
      window.location.href = "/auth/forgot-password";
    }
  }, [token]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

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

    if (!token) return;

    setIsPending(true);
    authClient.resetPassword(
      {
        newPassword: formData.password,
        token,
      },
      {
        onRequest: () => setIsPending(true),
        onSuccess: (data) => {
          setIsPending(false);
          setIsSuccess(true);
          console.log("Password reset successful:", data);
        },
        onError: (error) => {
          setIsPending(false);
          console.error("Password reset error:", error);
          setErrors({
            password: "Failed to reset password. Token may be expired.",
          });
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
              Password Reset
            </h2>
            <p className="text-sm opacity-80 mt-2">
              Your password has been successfully reset
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm text-green-800">
                You can now sign in with your new password.
              </p>
            </div>

            <Link
              href="/auth/signin"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
            >
              Continue to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background p-4 text-foreground">
        <div className="w-full max-w-md bg-background border border-foreground/20 rounded-lg shadow-sm">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Invalid Link
            </h2>
            <p className="text-sm opacity-80 mt-2 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 underline hover:text-blue-500 transition-colors duration-200"
            >
              Request a new reset link
            </Link>
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
            Reset Password
          </h2>
          <p className="text-sm opacity-80 mt-2">
            Enter your new password below
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isPending}
                  placeholder="Enter your new password"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isPending}
                  placeholder="Confirm your new password"
                  className={inputClasses + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-foreground/60 hover:text-foreground"
                  disabled={isPending}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Reset Password"
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

// Loading fallback component
function ResetPasswordFallback() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background p-4 text-foreground">
      <div className="w-full max-w-md bg-background border border-foreground/20 rounded-lg shadow-sm">
        <div className="p-6 text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-600" />
          <h2 className="text-2xl font-semibold mb-2">Loading</h2>
          <p className="text-foreground/70">Preparing password reset...</p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
