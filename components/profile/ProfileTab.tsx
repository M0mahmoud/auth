"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserData, UserErrors } from "./types";

interface ProfileTabProps {
  profileData: UserData;
  setProfileData: React.Dispatch<React.SetStateAction<UserData>>;
}

export default function ProfileTab({
  profileData,
  setProfileData,
}: ProfileTabProps) {
  const [profileErrors, setProfileErrors] = useState<UserErrors>({});
  const [isProfilePending, setIsProfilePending] = useState(false);

  const handleProfileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));

    if (profileErrors[name as keyof UserData]) {
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateProfileForm = (): UserErrors => {
    const newErrors: UserErrors = {};

    if (!profileData.name.trim()) newErrors.name = "Name is required";
    if (!profileData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profileData.email))
      newErrors.email = "Invalid email format";

    return newErrors;
  };

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validateProfileForm();

    if (Object.keys(newErrors).length > 0) {
      setProfileErrors(newErrors);
      return;
    }

    setIsProfilePending(true);
    authClient.updateUser(
      {
        name: profileData.name,
      },
      {
        onRequest: () => setIsProfilePending(true),
        onSuccess: () => {
          setIsProfilePending(false);
        },
        onError: () => {
          setIsProfilePending(false);
          setProfileErrors({
            email: "Failed to update profile. Email may already be in use.",
          });
        },
      }
    );
  };

  const inputClasses =
    "w-full px-3 py-2 border border-foreground/20 rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50";

  return (
    <div className="bg-background border border-foreground/20 rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={profileData.name}
              onChange={handleProfileInputChange}
              disabled={isProfilePending}
              className={inputClasses}
            />
            {profileErrors.name && (
              <p className="text-sm text-red-500 mt-1">{profileErrors.name}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isProfilePending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
          >
            {isProfilePending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
