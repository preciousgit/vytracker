"use client";

import { useState } from "react";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { postRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Define the form data structure with TypeScript
interface MedicalRecordFormData {
  doctorId: string;
  gender: string;
  age: string;
  bloodPressure: string;
  glucoseLevel: string;
  heartRate: string;
  oxygenLevel: string;
  allergies: string;
  weight: string;
  stepCount: string;
  sleepHours: string;
  nextAppointment: string;
  healthAlert: string;
  diagnosis: string;
  medication: string;
  bloodGroup: string;
  note: string;
}

const AddRecord: FC = () => {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    doctorId: "",
    gender: "",
    age: "",
    bloodPressure: "",
    glucoseLevel: "",
    heartRate: "",
    oxygenLevel: "",
    allergies: "",
    weight: "",
    stepCount: "",
    sleepHours: "",
    nextAppointment: "",
    healthAlert: "",
    diagnosis: "",
    medication: "",
    bloodGroup: "",
    note: ""
  });

  // Query mutation
  const mutation = useMutation({
    mutationFn: async (data: MedicalRecordFormData) => {
      try {
        const response = await postRequest("/HealthMetric/create/submit", data);
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
                : "Failed to add record"
            );
          }
        }
        throw new Error("Failed to add record. Please try again later.");
      }
    },
    onSuccess: () => {
      toast.success("Medical record added successfully!");
      setShowSuccessDialog(true);
      setFormData({
        doctorId: "",
        gender: "",
        age: "",
        bloodPressure: "",
        glucoseLevel: "",
        heartRate: "",
        oxygenLevel: "",
        allergies: "",
        weight: "",
        stepCount: "",
        sleepHours: "",
        nextAppointment: "",
        healthAlert: "",
        diagnosis: "",
        medication: "",
        bloodGroup: "",
        note: ""
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while adding the record");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
    router.push("/medical-records"); // Update this path to your actual medical records history page
    setShowSuccessDialog(false);
  };

  const addAnotherRecord = () => {
    setShowSuccessDialog(false);
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Medical Record</CardTitle>
          <CardDescription>Enter the patient&apos;s medical information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter patient's age"
                  required
                />
              </div>
              {/* Repeat similar fields for other inputs */}
              <div className="grid gap-2">
                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                <Input
                  id="bloodPressure"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="Enter Patient's Blood Pressure"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="glucoseLevel">Glucose Level</Label>
                <Input
                  id="glucoseLevel"
                  name="glucoseLevel"
                  type="number"
                  value={formData.glucoseLevel}
                  onChange={handleChange}
                  placeholder="Enter Patient's Glucose Level"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="heartRate">Heart Rate</Label>
                <Input
                  id="heartRate"
                  name="heartRate"
                  type="number"
                  value={formData.heartRate}
                  onChange={handleChange}
                  placeholder="Enter Patient's Heart Rate"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="oxygenLevel">Oxygen Level</Label>
                <Input
                  id="oxygenLevel"
                  name="oxygenLevel"
                  type="number"
                  value={formData.oxygenLevel}
                  onChange={handleChange}
                  placeholder="Enter Patient's Oxygen Level"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="Enter Patient's Allergies"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Enter Patient's Weight"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stepCount">Step Count</Label>
                <Input
                  id="stepCount"
                  name="stepCount"
                  type="number"
                  value={formData.stepCount}
                  onChange={handleChange}
                  placeholder="Enter Patient's Step Count"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sleepHours">Sleep Hours</Label>
                <Input
                  id="sleepHours"
                  name="sleepHours"
                  type="number"
                  value={formData.sleepHours}
                  onChange={handleChange}
                  placeholder="Enter Patient's Sleep Hours"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nextAppointment">Next Appointment</Label>
                <Input
                  id="nextAppointment"
                  name="nextAppointment"
                  value={formData.nextAppointment}
                  onChange={handleChange}
                  placeholder="Enter Patient's Next Appointment"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="healthAlert">Health Alert</Label>
                <Input
                  id="healthAlert"
                  name="healthAlert"
                  value={formData.healthAlert}
                  onChange={handleChange}
                  placeholder="Enter Patient's Health Alert"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  placeholder="Enter Patient's Diagnosis"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="medication">Medications</Label>
                <Input
                  id="medication"
                  name="medication"
                  value={formData.medication}
                  onChange={handleChange}
                  placeholder="Enter Patient's Medication"
                />
              </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              <div className="grid gap-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Additional notes about the patient"
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Submit Medical Record"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/medical-records")}
              >
                View Records History
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog with navigation options */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">✅ Record Added Successfully</DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-600 py-4">
            <p className="mb-4">The medical record has been successfully added to the system.</p>
            <p className="font-medium">What would you like to do next?</p>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <Button onClick={navigateToHistory} className="w-full">
              View Medical Records History
            </Button>
            <Button variant="outline" onClick={addAnotherRecord} className="w-full">
              Add Another Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRecord;