"use client";

import type * as React from "react";
import { useEffect } from "react";
import { Star, LayoutDashboard, LogOut, Menu, CreditCard, LifeBuoy, Map, FileText, Send, Hospital, CalendarCheck, Stethoscope } from 'lucide-react';
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Sidebar Styles Component
const SidebarStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .collapsed-scrollbar-hidden[data-state="closed"] ::-webkit-scrollbar {
        display: none;
      }
      
      .collapsed-scrollbar-hidden[data-state="closed"] {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Book Appointment",
      url: "/book-appointment",
      icon: CalendarCheck,
    },
    {
      title: "Doctors",
      url: "#",
      icon: Stethoscope,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Specialties",
      url: "#",
      icon: Star,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Healthcare Centers",
      url: "#",
      icon: Hospital,
      items: [
        { title: "Pharmacies", url: "#" },
        { title: "Hospitals", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
  ],
  projects: [
    { name: "Subscription", url: "#", icon: CreditCard },
    { name: "Medical Records", url: "#", icon: FileText },
    { name: "Travel", url: "#", icon: Map },
  ],
  logout: [
    { title: "Logout", url: "#", icon: LogOut },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();

  return (
    <>
      <SidebarStyles /> {/* Inject styles globally */}
      <Sidebar
        variant="inset"
        collapsible="icon"
        className="collapsed-scrollbar-hidden"
        {...props}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" onClick={toggleSidebar}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Menu className="size-4" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavSecondary items={data.logout} className="-ml-2"/>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}