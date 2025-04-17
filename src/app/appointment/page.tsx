"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/registry/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/registry/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/registry/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getRequest, postRequest } from "@/lib/api";

// Define the specialist type
interface Specialist {
  id: string;
  name: string;
}

// Define the appointment data structure
interface AppointmentFormData {
  specialist: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  appointmentType: string;
  healthStatus: string;
}

const AppointmentPage = () => {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    specialist: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    appointmentType: "",
    healthStatus: "",
  });

  // Fetch specialists from API
  const { data: specialists = [] } = useQuery({
    queryKey: ["specialists"],
    queryFn: async () => {
      try {
        const response = await getRequest("/Specialties/retrieve/all",  { headers: { Authorization: "Bearer token" } });
        // Check if response.data exists and is not undefined
        if (response && response.data) {
          return response.data;
        } else {
          return [
            "Anesthesiologist", "Cardiologist", "Dermatologist",
            "Family Medicine", "Gastroenterologist", "General Practitioner",
            "Gynecologist", "Nephrologist", "Neurologist", "Obstetrician",
            "Oncologist", "Ophthalmologist", "Orthopedic Surgeon",
            "Otolaryngologist (ENT)", "Pediatrician",
            "Physiatrist", "Plastic Surgeon",
            "Psychiatrist", "Radiologist", "Rheumatologist", "Surgeon",
            "Urologist", "Vascular Surgeon", "Public Health Specialist"
          ];
        }
      } catch (error) {
        console.error("Error fetching specialists:", error);
        return [
          "Anesthesiologist", "Cardiologist", "Dermatologist",
          "Family Medicine", "Gastroenterologist", "General Practitioner",
          "Gynecologist", "Nephrologist", "Neurologist", "Obstetrician",
          "Oncologist", "Ophthalmologist", "Orthopedic Surgeon",
          "Otolaryngologist (ENT)", "Pediatrician",
          "Physiatrist", "Plastic Surgeon",
          "Psychiatrist", "Radiologist", "Rheumatologist", "Surgeon",
          "Urologist", "Vascular Surgeon", "Public Health Specialist"
        ];
      }
    },
  });

  // Query mutation for appointment creation
  const mutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      try {
        const response = await postRequest("/Appointments/book/appointment",  data );
        return response.data;
      } catch (error: unknown) {
        if (error && typeof error === "object" && "response" in error) {
          const errorResponse = (error as { response?: { data?: unknown } }).response;
          if (errorResponse?.data) {
            const errorData = errorResponse.data;
            throw new Error(
              typeof errorData === "string"
                ? errorData
                : typeof errorData === "object" && errorData !== null && "message" in errorData
                ? String(errorData.message)
                : "Failed to book appointment"
            );
          }
        }
        throw new Error("Failed to book appointment. Please try again later.");
      }
    },
    onSuccess: () => {
      toast.success("Appointment booked successfully!");
      setShowSuccessDialog(true);
      setFormData({
        specialist: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        description: "",
        appointmentType: "",
        healthStatus: ""
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while booking the appointment");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: val,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const navigateToHistory = () => {
    router.push("/appointment-history");
    setShowSuccessDialog(false);
  };

  const bookAnotherAppointment = () => {
    setShowSuccessDialog(false);
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Book Appointment</CardTitle>
          <CardDescription>Schedule a new appointment with a medical specialist</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="specialist">Specialist <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.specialist}
                  onValueChange={(value) => handleSelectChange("specialist", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Specialist" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialists.map((specialist: string | Specialist, index: number) => (
                      <SelectItem 
                        key={index} 
                        value={typeof specialist === 'object' ? specialist.id : specialist}
                      >
                        {typeof specialist === 'object' ? specialist.name : specialist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter appointment location"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time <span className="text-red-500">*</span></Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="appointmentType">Appointment Type</Label>
                <Select
                  value={formData.appointmentType}
                  onValueChange={(value) => handleSelectChange("appointmentType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="followUp">Follow-up</SelectItem>
                    <SelectItem value="checkup">Regular Check-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="therapy">Therapy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                       
              <div className="grid gap-2">
                <Label htmlFor="healthStatus">Current Health Status</Label>
                <Select
                  value={formData.healthStatus}
                  onValueChange={(value) => handleSelectChange("healthStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter appointment details, symptoms, or concerns"
                rows={4}
              />
            </div>
            
            <div className="flex gap-4 mt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Processing..." : "Book Appointment"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/appointment-history")}
              >
                View Appointment History
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog with navigation options */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">✅ Appointment Booked Successfully</DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-600 py-4">
            <p className="mb-4">Your appointment has been successfully scheduled.</p>
            <p className="font-medium">What would you like to do next?</p>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <Button onClick={navigateToHistory} className="w-full">
              View Appointment History
            </Button>
            <Button variant="outline" onClick={bookAnotherAppointment} className="w-full">
              Book Another Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentPage;