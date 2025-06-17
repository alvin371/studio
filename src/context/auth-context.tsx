
"use client";

import type { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Function to check bypass status, client-side only
  const isBypassActive = (): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bypassUser") === "true";
    }
    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return; // Wait if Firebase auth state is still loading

    const bypassActive = isBypassActive();
    const onAuthPage = pathname.startsWith('/auth');

    // If there's a Firebase user or bypass is active, the user is "authenticated"
    if (user || bypassActive) {
      // If on an auth page but "authenticated", redirect to dashboard
      if (onAuthPage) {
        router.push('/dashboard');
      }
      return; // Allowed to stay on current non-auth page or redirected from auth page
    }

    // At this point: no Firebase user, bypass not active, and auth is not loading.
    // If not on an auth page or the root page (which redirects to dashboard), then redirect to sign-in.
    const isRootPage = pathname === '/';
    
    if (!onAuthPage && !isRootPage) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router, pathname]);

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("bypassUser"); // Clear bypass flag
      }
      router.push('/auth/sign-in');
    } catch (error) {
      console.error("Error signing out: ", error);
      // In a real app, use a toast notification for errors
    } finally {
      setLoading(false);
    }
  };
  
  // Show global loader only if auth is genuinely loading, bypass is not active, and not on an auth page.
  if (loading && !isBypassActive() && !pathname.startsWith('/auth')) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
