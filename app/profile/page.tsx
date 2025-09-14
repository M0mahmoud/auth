"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  ProfileTabs,
  ProfileTab,
  PasswordTab,
  SessionsTab,
  UserData,
  ActiveTab,
} from "@/components/profile";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [profileData, setProfileData] = useState<UserData>({
    name: "",
    email: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        const user = session.data.user;
        const userData = {
          name: user.name || "",
          email: user.email || "",
        };
        setProfileData(userData);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-foreground/70 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Navigation Tabs */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "profile" && (
          <ProfileTab
            profileData={profileData}
            setProfileData={setProfileData}
          />
        )}

        {activeTab === "password" && <PasswordTab />}

        {activeTab === "sessions" && <SessionsTab />}

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 underline hover:text-blue-500 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
