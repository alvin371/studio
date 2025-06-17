
"use client";

import * as React from "react";
import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Icons } from "@/components/icons";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

// Helper function to check bypass status (client-side only)
const isBypassActive = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("bypassUser") === "true";
  }
  return false;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [pageTitle, setPageTitle] = React.useState("Dashboard");

  React.useEffect(() => {
    const bypass = isBypassActive();
    if (!loading && !user && !bypass) {
      router.push("/auth/sign-in");
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    const currentNavItem = [...siteConfig.mainNav, ...siteConfig.settingsNav].find(item => item.href === pathname);
    if (currentNavItem) {
      setPageTitle(currentNavItem.title);
    } else if (pathname === "/dashboard") {
      setPageTitle("Dashboard");
    }
  }, [pathname]);

  // Show loader if Firebase auth is loading, or if not authenticated (no user and no bypass)
  const bypass = isBypassActive(); // Check here for loading state decision
  if (loading || (!user && !bypass)) {
    // If AuthProvider's global loader is also active, this might be redundant,
    // but it ensures DashboardLayout itself doesn't render content prematurely.
    // The AuthProvider's loader is more for the initial app load.
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarRail />
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Icons.Logo className="h-7 w-7 text-primary group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
            <h1 className="text-xl font-headline font-semibold group-data-[collapsible=icon]:hidden">
              {siteConfig.name}
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <MainNav items={siteConfig.mainNav} />
        </SidebarContent>
        <SidebarFooter className="p-2">
          <Separator className="my-2" />
          <MainNav items={siteConfig.settingsNav} />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-lg font-headline font-semibold">{pageTitle}</h2>
            </div>
            <div className="flex items-center gap-x-4">
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
         <footer className="border-t p-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} RetailFlow. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
