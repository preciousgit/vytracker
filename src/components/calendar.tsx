"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { addDays } from "date-fns"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  appointments?: Date[]
}

function Calendar({ className, classNames, showOutsideDays = true, appointments = [], ...props }: CalendarProps) {
  const today = new Date()
  const [month, setMonth] = React.useState<Date>(today)

  // Sample appointments for demo
  const [appointmentDates, setAppointmentDates] = React.useState<Date[]>(
    appointments.length ? appointments : [addDays(today, 2), addDays(today, 7), addDays(today, 15)],
  )

  const handleDayClick = (day: Date) => {
    // Check if the day is already marked as an appointment
    const isAppointment = appointmentDates.some((date) => date.toDateString() === day.toDateString())

    if (isAppointment) {
      // Remove the appointment
      setAppointmentDates(appointmentDates.filter((date) => date.toDateString() !== day.toDateString()))
    } else {
      // Add the appointment
      setAppointmentDates([...appointmentDates, day])
    }
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-row space-x-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn("h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        NavPrev: ChevronLeft,
        NavNext: ChevronRight,
      }}
      month={month}
      onMonthChange={setMonth}
      modifiers={{
        appointment: appointmentDates,
      }}
      modifiersStyles={{
        appointment: {
          border: "2px solid var(--primary)",
          borderRadius: "50%",
        },
      }}
      onDayClick={handleDayClick}
      numberOfMonths={2}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

