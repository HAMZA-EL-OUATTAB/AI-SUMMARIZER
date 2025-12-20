"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  fetchUserProfile,
  updateUserProfile,
  updatePassword,
  deleteAccount,
  UserProfile,
} from "@/lib/api";

export function ProfileAlert() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await fetchUserProfile(token);
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full">
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="text-sm truncate">{user?.email || "Loading..."}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[90vw] md:max-w-[50vw]">
        <AlertDialogHeader>
          <AlertDialogTitle>Profile</AlertDialogTitle>
          <AlertDialogDescription>
            {loading && "Loading..."}
            {error && <span className="text-destructive">{error}</span>}
            {user && (
              <div className="space-y-4 mt-2">
                <p><strong>Full Name:</strong> {user.full_name}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {/* Here you can add update forms and password change buttons */}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button>Close</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
