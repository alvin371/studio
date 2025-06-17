"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, type NavItem } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { TooltipContent } from "@/components/ui/tooltip";

interface MainNavProps {
  items?: NavItem[];
  isMobile?: boolean;
}

export function MainNav({ items, isMobile = false }: MainNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              disabled={item.disabled}
              aria-label={item.title}
              tooltip={!isMobile ? { children: item.title, side: "right", align: "center" } : undefined}
            >
              <Link href={item.disabled ? "#" : item.href}>
                <Icon aria-hidden="true" />
                <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
