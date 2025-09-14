"use client";
import React from "react";
import { User, Shield, Settings } from "lucide-react";
import { ActiveTab } from "./types";

interface ProfileTabsProps {
  activeTab: ActiveTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
}

export default function ProfileTabs({
  activeTab,
  setActiveTab,
}: ProfileTabsProps) {
  const tabClasses = (tab: string) =>
    `px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      activeTab === tab
        ? "bg-blue-100 text-blue-700 border border-blue-200"
        : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
    }`;

  return (
    <div className="mb-8">
      <nav className="flex space-x-1 bg-foreground/5 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("profile")}
          className={tabClasses("profile")}
        >
          <User className="w-4 h-4 mr-2 inline" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={tabClasses("password")}
        >
          <Shield className="w-4 h-4 mr-2 inline" />
          Password
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={tabClasses("sessions")}
        >
          <Settings className="w-4 h-4 mr-2 inline" />
          Sessions
        </button>
      </nav>
    </div>
  );
}
