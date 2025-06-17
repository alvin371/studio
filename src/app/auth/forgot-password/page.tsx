"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MailQuestion, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox (and spam folder) for instructions to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Error Sending Reset Email",
        description: error.message || "Could not send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-border/60">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-3xl font-headline">Forgot Password?</CardTitle>
        <CardDescription>No worries! Enter your email to receive reset instructions.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordReset} className="space-y-6">
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
          <Button type="submit" className="w-full font-semibold h-11 text-base" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MailQuestion className="mr-2 h-5 w-5" />}
            Send Reset Link
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm">
         <Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
            <Link href="/auth/sign-in" tabIndex={isLoading ? -1 : 0}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Sign In
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
