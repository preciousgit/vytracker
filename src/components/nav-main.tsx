"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useState } from "react";

export function NavMain({
  items,
}: Readonly<{
  items: ReadonlyArray<{
    title: string;
    url: string;
    icon: LucideIcon;
    items?: ReadonlyArray<{
      title: string;
      url: string;
    }>;
  }>;
}>) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const handleNavigation = (url: string) => {
    setActiveItem(url); // Update the active state
    navigate(url); // Navigate to the selected page
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = activeItem === item.url;

          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive}>
              <SidebarMenuItem>
                {/* Sidebar Menu Button */}
                <SidebarMenuButton asChild tooltip={item.title}>
                  <button
                    onClick={() => handleNavigation(item.url)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-500 text-white pointer-events-none" // Active state (no hover)
                        : "hover:bg-gray-200" // Only inactive items have hover
                    }`}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuButton>

                {/* Submenu */}
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubActive = activeItem === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <button
                                  onClick={() => handleNavigation(subItem.url)}
                                  className={`block px-4 py-2 rounded-lg transition-colors ${
                                    isSubActive
                                      ? "bg-blue-400 text-white pointer-events-none"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  <span>{subItem.title}</span>
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
