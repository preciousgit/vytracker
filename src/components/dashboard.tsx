"use client";

import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Bell, Search, Settings, UserCircle } from "lucide-react";
import { Calendar } from "../components/calendar";
import { CalorieChart } from "../components/calorie-chart"

export default function Dashboard() {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar className="pt-16" />

      {/* Dashboard Wrapper with Padding */}
      <SidebarInset className="pt-16">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 shrink-0 items-center justify-between px-4 bg-white shadow-md">
          {/* Left: Notification & Settings Icons */}
          <div className="flex items-center gap-4">
            <Bell className="size-5 cursor-pointer text-gray-600 hover:text-primary" />
            <Settings className="size-5 cursor-pointer text-gray-600 hover:text-primary" />
          </div>

          {/* Center: Search Bar */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          </div>

          {/* Right: Greeting & Profile */}
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-medium sm:block">Hello, User!</span>
            <UserCircle className="size-7 text-gray-600" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Appointment Calendar</h2>
            <div className="flex justify-center overflow-auto">
              <Calendar />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <CalorieChart />
            <div className="grid gap-6">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-medium">Today&apos;s Summary</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Calories Consumed</span>
                    <span className="font-semibold">1,850 / 2,000</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[92.5%] rounded-full bg-primary"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Water Intake</span>
                    <span className="font-semibold">1.5L / 2.5L</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[60%] rounded-full bg-blue-500"></div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-medium">Upcoming Appointments</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-sm font-medium">15</span>
                    </div>
                    <div>
                      <p className="font-medium">Doctor&apos;s Appointment</p>
                      <p className="text-sm text-muted-foreground">10:00 AM - 11:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-sm font-medium">22</span>
                    </div>
                    <div>
                      <p className="font-medium">Gym Session</p>
                      <p className="text-sm text-muted-foreground">6:00 PM - 7:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
