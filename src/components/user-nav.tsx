
"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

// Helper function to check bypass status (client-side only)
const isBypassActiveClient = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("bypassUser") === "true";
  }
  return false;
};

export function UserNav() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [bypassUserActive, setBypassUserActive] = useState(false);

  useEffect(() => {
    // This effect runs only on the client after the component mounts
    setBypassUserActive(isBypassActiveClient());
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(); // signOut from AuthContext handles localStorage clear and navigation
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
    } catch (error) {
      toast({ title: "Sign Out Error", description: "Failed to sign out. Please try again.", variant: "destructive" });
    } finally {
      setIsSigningOut(false);
    }
  };

  if (authLoading) {
    return (
      <Button variant="ghost" className="relative h-9 w-9 rounded-full" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  let displayName: string;
  let userEmail: string;
  let photoURL: string | null | undefined;
  let initials: string;
  let isActualUser = !!user;

  const getInitialsFromName = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1 && names[0].length > 0) {
      return names[0].substring(0, 2).toUpperCase();
    }
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return "XX"; // Fallback initials
  };

  if (isActualUser) {
    displayName = user.displayName || "User";
    userEmail = user.email || "No email provided";
    photoURL = user.photoURL;
    initials = getInitialsFromName(displayName);
  } else if (bypassUserActive) {
    displayName = "Bypass User";
    userEmail = "bypass@example.com";
    photoURL = null; // Bypass user has no specific photoURL
    initials = "BU";
  } else {
    // No Firebase user and bypass is not active (or still determining client-side)
    return null;
  }
  
  const avatarImageSrc = photoURL || `https://placehold.co/100x100.png?text=${initials}`;
  const avatarImageHint = photoURL ? "user avatar" : "user avatar placeholder";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarImageSrc} alt={displayName} data-ai-hint={avatarImageHint} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild disabled={!isActualUser} style={!isActualUser ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
            <Link href="/dashboard/settings" tabIndex={!isActualUser ? -1 : 0}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
