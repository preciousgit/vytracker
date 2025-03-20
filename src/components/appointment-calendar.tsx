"use client"

import * as React from "react"
import { format, isValid } from "date-fns"
import { CalendarIcon, Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

// Sample appointment data
const appointments = [
  {
    id: 1,
    title: "Team Standup",
    date: new Date(2025, 2, 15),
    time: "10:00 AM",
    duration: "30 min",
    attendees: ["John Doe", "Jane Smith", "Robert Johnson"],
    location: "Conference Room A",
  },
  {
    id: 2,
    title: "Project Review",
    date: new Date(2025, 2, 18),
    time: "2:00 PM",
    duration: "1 hour",
    attendees: ["Sarah Williams", "Michael Brown", "Emily Davis"],
    location: "Virtual Meeting",
  },
  {
    id: 3,
    title: "Client Meeting",
    date: new Date(2025, 2, 22),
    time: "11:30 AM",
    duration: "45 min",
    attendees: ["David Wilson", "Lisa Anderson"],
    location: "Client Office",
  },
]

export function AppointmentCalendar() {
  const [date, setDate] = React.useState<Date>(new Date(2025, 2, 18))

  // Function to check if a date has appointments
  const hasAppointment = (day: Date | undefined) => {
    if (!day || !isValid(day)) return false

    return appointments.some(
      (appointment) =>
        appointment.date.getDate() === day.getDate() &&
        appointment.date.getMonth() === day.getMonth() &&
        appointment.date.getFullYear() === day.getFullYear(),
    )
  }

  // Function to get appointment for a specific date
  const getAppointment = (day: Date | undefined) => {
    if (!day || !isValid(day)) return undefined

    return appointments.find(
      (appointment) =>
        appointment.date.getDate() === day.getDate() &&
        appointment.date.getMonth() === day.getMonth() &&
        appointment.date.getFullYear() === day.getFullYear(),
    )
  }

  return (
    <Card className="@container/calendar">
      <CardHeader>
        <CardTitle>Appointment Calendar</CardTitle>
        <CardDescription>View and manage your upcoming appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 @lg/calendar:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Selected Date</h3>
              <p className="text-sm text-muted-foreground">{format(date, "EEEE, MMMM do, yyyy")}</p>

              {hasAppointment(date) ? (
                <div className="mt-4 space-y-4">
                  {(() => {
                    const appointment = getAppointment(date)
                    if (!appointment) return null

                    return (
                      <>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{appointment.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {appointment.time} ({appointment.duration})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {appointment.attendees.map((attendee) => (
                              <HoverCard key={`${appointment.id}-${attendee}`}>
                                <HoverCardTrigger asChild>
                                  <Badge variant="secondary" className="cursor-pointer">
                                    {attendee.split(" ")[0]}
                                  </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-fit">{attendee}</HoverCardContent>
                              </HoverCard>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button size="sm">Chat Now</Button>
                        </div>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <p className="text-sm text-muted-foreground">No appointments scheduled</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Add Appointment
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Upcoming</h3>
              <div className="mt-2 space-y-2">
                {appointments
                  .filter((app) => app.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 3)
                  .map((app) => (
                    <div
                      key={app.id}
                      className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted/50"
                      onClick={() => setDate(app.date)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setDate(app.date)
                        }
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{app.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(app.date, "MMM d")} · {app.time}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}