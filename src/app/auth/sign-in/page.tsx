
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from "lucide-react";

// Bypass credentials -
// WARNING: For development/testing only. Do not use in production.
const BYPASS_EMAIL = "bypass@example.com";
const BYPASS_PASSWORD = "password123";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Bypass login check
    if (email === BYPASS_EMAIL && password === BYPASS_PASSWORD) {
      toast({
        title: "Bypass Login Successful",
        description: "Logged in with bypass credentials.",
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("bypassUser", "true");
      }
      router.push("/dashboard");
      // setIsLoading(false); // Handled in finally block
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (typeof window !== "undefined") {
        localStorage.removeItem("bypassUser"); // Clear bypass if regular login succeeds
      }
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Sign-in Failed",
        description: error.code === 'auth/invalid-credential' ? 'Invalid email or password.' : (error.message || "Please check your credentials and try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-border/60">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
        <CardDescription>Sign in to access your dashboard. (Bypass: bypass@example.com / password123)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
               <Link href="/auth/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
                tabIndex={isLoading ? -1 : 0}
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full font-semibold h-11 text-base" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm flex-col space-y-2">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="font-medium text-primary hover:underline" tabIndex={isLoading ? -1 : 0}>
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
