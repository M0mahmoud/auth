"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage(
          "Invalid verification link. Please check your email for the correct link."
        );
        return;
      }

      try {
        await authClient.verifyEmail({
          query: { token },
        });

        setStatus("success");
        setMessage(
          "Your email has been successfully verified! You can now sign in to your account."
        );

        // Redirect to signin page after 3 seconds
        setTimeout(() => {
          window.location.href = "/auth/signin";
        }, 3000);
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage(
          "Failed to verify email. The link may have expired or is invalid."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background p-4 text-foreground">
      <div className="w-full max-w-md bg-background border border-foreground/20 rounded-lg shadow-sm">
        <div className="p-6 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-600" />
              <h2 className="text-2xl font-semibold mb-2">Verifying Email</h2>
              <p className="text-foreground/70">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-green-600">
                Email Verified!
              </h2>
              <p className="text-foreground/70 mb-4">{message}</p>
              <p className="text-sm text-foreground/60">
                Redirecting to sign in page...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-red-600">
                Verification Failed
              </h2>
              <p className="text-foreground/70 mb-6">{message}</p>
              <div className="space-y-2">
                <a
                  href="/auth/signin"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Go to Sign In
                </a>
                <a
                  href="/auth/signup"
                  className="block w-full text-blue-600 hover:text-blue-500 text-sm underline"
                >
                  Sign up again
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function VerifyEmailFallback() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background p-4 text-foreground">
      <div className="w-full max-w-md bg-background border border-foreground/20 rounded-lg shadow-sm">
        <div className="p-6 text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-600" />
          <h2 className="text-2xl font-semibold mb-2">Loading</h2>
          <p className="text-foreground/70">Preparing email verification...</p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
