"use client";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Bell, Search, Home, UserCircle } from "lucide-react";
import Image from "next/image";
import logo from "../../public/Vytrack.png";
import BookAppointment from "./BookAppointment";
import { DashboardContent } from "./DashboardContent";
import SpecialistSection from "./SpecialistSection";
import Profile from "../app/profile/page";


export default function Dashboard() {
  return (
    <Router>
      <SidebarProvider>
        {/* Sidebar */}
        <AppSidebar className="pt-20" />

        {/* Dashboard Wrapper with Padding */}
        <SidebarInset className="pt-16">
          {/* Fixed Header */}
          <header className="fixed top-0 left-0 right-0 z-50 flex h-20 shrink-0 items-center justify-between px-4 bg-white shadow-md">
            {/* Left: Notification & Settings Icons */}
              <Image
                src={logo}
                alt="Vy-Tracker Logo"
                width={120}
                height={10}
                className="mb-4 -ml-8 cursor-pointer"
              />
            <div className="flex items-center gap-4">
              <Home className="size-7 cursor-pointer text-gray-600 hover:text-primary" />

              {/* Center: Search Bar */}
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-120 rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
              </div>
            </div>

            {/* Right: Greeting & Profile */}
            <div className="flex items-center gap-4">
              <Bell className="size-8 cursor-pointer text-gray-600 hover:text-primary" />
              <span className="hidden text-sm font-medium sm:block">
                Hello, User!
              </span>
              <Link to="/profile">
                <UserCircle className="size-8 text-gray-600 hover:text-primary" />
              </Link>
            </div>
          </header>

          {/* Dashboard Content */}
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/specialists" element={<SpecialistSection />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />{" "}
            {/* Redirect to DashboardContent for any unknown routes */}
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </Router>
  );
}
