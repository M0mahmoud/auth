"use client";

import Link from "next/link";

import Logout from "./Logout";
import { authClient } from "@/lib/auth-client";

export default function Navigation() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <nav className="bg-blue-600 border-b border-blue-600 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          Auth App
        </Link>

        <div className="flex items-center space-x-4">
          {isPending ? (
            // Loading skeleton
            <div className="flex gap-2">
              <div className="w-20 h-8 bg-blue-500 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-blue-500 rounded animate-pulse"></div>
            </div>
          ) : session?.user ? (
            <>
              <Link
                href="/profile"
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Profile
              </Link>
              <Logout />
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
