import {} from "react-router-dom";
import { useEffect } from "react";
import { AppointmentCalendar } from "@/components/appointment-calendar";
import { CalorieChart } from "../components/calorie-chart";
  
export function DashboardContent() {
    useEffect(() => {
      // Any code that accesses `document` or other browser-specific APIs should go here
      if (typeof document !== "undefined") {
        // Your client-side code here
      }
    }, []);
  
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="bg-blue-500 p-6 rounded-lg">
            <AppointmentCalendar />
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
                                    <p className="text-sm text-muted-foreground">
                                    10:00 AM - 11:00 AM
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <span className="text-sm font-medium">22</span>
                                </div>
                                <div>
                                    <p className="font-medium">Gym Session</p>
                                    <p className="text-sm text-muted-foreground">
                                    6:00 PM - 7:30 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    );
  }