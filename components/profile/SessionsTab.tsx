"use client";
import React, { useState, useEffect } from "react";
import { Loader2, LogOut, Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Session } from "./types";

export default function SessionsTab() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSessionsPending, setIsSessionsPending] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsSessionsPending(true);
      const response = await authClient.listSessions();
      if (response?.data) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setIsSessionsPending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/auth/signin";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await authClient.revokeSession({ token: sessionId });
      loadSessions(); // Reload sessions after revoking
    } catch (error) {
      console.error("Revoke session error:", error);
    }
  };

  return (
    <div className="bg-background border border-foreground/20 rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Sessions</h2>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out All Devices
          </button>
        </div>

        {isSessionsPending ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-foreground/20 rounded-md"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Session</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 mt-1">
                    {session.userAgent || "Unknown device"}
                  </p>
                  <p className="text-xs text-foreground/50">
                    Created: {new Date(session.createdAt).toLocaleString()}
                  </p>
                  {session.ipAddress && (
                    <p className="text-xs text-foreground/50">
                      IP: {session.ipAddress}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRevokeSession(session.token)}
                  className="text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors duration-200"
                  title="Revoke session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
