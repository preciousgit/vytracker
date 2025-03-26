"use client";

import type * as React from "react";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { LucideIcon, ChevronDown, ChevronRight, Phone } from 'lucide-react';
import { 
  Star, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  CreditCard,  
  Map, 
  FileText, 
  Send, 
  Hospital, 
  CalendarCheck, 
  Stethoscope, 
  Computer 
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  useSidebar 
} from "@/components/ui/sidebar";

// Define interfaces for type safety
interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: NavItem[];
}

interface NavMainProps {
  items: NavItem[];
}

interface NavProjectsProps {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}

interface NavSecondaryProps {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
  className?: string;
}

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

// Updated NavMain component with dropdown functionality
const NavMain: React.FC<NavMainProps> = ({ items }) => {
  // State to manage which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Toggle dropdown for a specific item
  const toggleDropdown = (title: string) => {
    setOpenDropdown(prev => prev === title ? null : title);
  };

  return (
    <nav>
      {items.map((item, index) => (
        <div key={index}>
          {item.items ? (
            <div>
              <div 
                onClick={() => toggleDropdown(item.title)}
                className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  <item.icon className="mr-2" />
                  {item.title}
                </div>
                {openDropdown === item.title ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
              {openDropdown === item.title && (
                <div className="pl-4">
                  {item.items.map((subItem, subIndex) => (
                    <Link 
                      key={subIndex} 
                      href={subItem.url} 
                      className="flex items-center p-2 hover:bg-gray-100"
                    >
                      <subItem.icon className="mr-2" />
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link 
              href={item.url} 
              className="flex items-center p-2 hover:bg-gray-100"
            >
              <item.icon className="mr-2" />
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

// New NavProjects component
const NavProjects: React.FC<NavProjectsProps> = ({ projects }) => {
  return (
    <nav className="mt-4">
      <h3 className="px-2 text-xs text-gray-500">Projects</h3>
      {projects.map((project, index) => (
        <Link 
          key={index} 
          href={project.url} 
          className="flex items-center p-2 hover:bg-gray-100"
        >
          <project.icon className="mr-2" />
          {project.name}
        </Link>
      ))}
    </nav>
  );
};

// New NavSecondary component
const NavSecondary: React.FC<NavSecondaryProps> = ({ items, className }) => {
  return (
    <nav className={className}>
      {items.map((item, index) => (
        <Link 
          key={index} 
          href={item.url} 
          className="flex items-center p-2 hover:bg-gray-100"
        >
          <item.icon className="mr-2" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Book Appointment",
      url: "/appointment",
      icon: CalendarCheck,
    },
    {
      title: "Doctors",
      url: "/doctors",
      icon: Stethoscope,
    },
    {
      title: "Specialties",
      url: "/specialties",
      icon: Star,
    },
    {
      title: "Healthcare Centers",
      url: "/healthcare-centers",
      icon: Hospital,
      items: [
        { title: "Pharmacies", url: "/pharmacy", icon: Hospital },
        { title: "Hospitals", url: "/hospital", icon: Hospital },
      ],
    },
    {
      title: "Ask AI Question",
      url: "/chatsearch",
      icon: Computer,
    },
  ],
  projects: [
    { name: "Subscription", url: "/project1", icon: CreditCard },
    { name: "Contact desk", url: "/chatBox", icon: Phone },
    { name: "Project 3", url: "/project3", icon: Map },
  ],
  navSecondary: [
    { title: "Help", url: "/help", icon: FileText },
    { title: "Support", url: "/support", icon: Send },
  ],
  logout: [
    { title: "Logout", url: "/login", icon: LogOut },
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();

  return (
    <>
      <SidebarStyles />
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