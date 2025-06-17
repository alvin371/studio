import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Package, Archive, ShoppingCart, ListOrdered, Brain, Settings, Store } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
};

export const siteConfig = {
  name: "RetailFlow",
  description: "Modern Point-of-Sale (POS) web application for retail businesses.",
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: Package,
    },
    {
      title: "Inventory",
      href: "/dashboard/inventory",
      icon: Archive,
    },
    {
      title: "Point of Sale",
      href: "/dashboard/sales",
      icon: ShoppingCart,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: ListOrdered,
    },
    {
      title: "AI Assistant",
      href: "/dashboard/ai-assistant",
      icon: Brain,
    },
  ] satisfies NavItem[],
  settingsNav: [
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ] satisfies NavItem[],
};

export type SiteConfig = typeof siteConfig;
