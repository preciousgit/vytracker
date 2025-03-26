"use client";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { Bell, Home, UserCircle } from "lucide-react";
import Image from "next/image";
import logo from "../../public/Vytrack.png";
import BookAppointment from "./BookAppointment";
import { DashboardContent } from "./DashboardContent";
import Link from "next/link";


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
            {/* Left: Logo */}
            <Image
              src={logo}
              alt="Vy-Tracker Logo"
              width={120}
              height={20} 
              className="mb-4"
            />
              {/* Center: Home */}
              <div className="grid grid-flow-col items-center gap-4">
            <Link href="/dashboard" passHref>
              <Home className="size-7 text-gray-600 hover:text-primary cursor-pointer" />
            </Link>
          </div>

            {/* Right: Greeting & Profile */}
            <div className="flex items-center gap-4">
              <Bell className="size-8 cursor-pointer text-gray-600 hover:text-primary" />
              <span className="hidden text-sm font-medium sm:block">
                Hello, User!
              </span>
              <UserCircle className="size-8 text-gray-600" />
            </div>
          </header>

          {/* Dashboard Content */}
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to DashboardContent for any unknown routes */}
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </Router>
  );
}
