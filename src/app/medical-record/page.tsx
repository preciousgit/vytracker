"use client";

import { useState } from "react";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { postRequest, getRequest } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";


// Define interfaces for type safety
interface MedicalRecordFormData {
  id?: string;
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
  createdAt?: string;
}

// Medical Records Page Component
const MedicalRecordsPage: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const [activeView, setActiveView] = useState<'form' | 'history'>('form');
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

  // Fetch medical records query
  const {
    data: medicalRecords = [],
    isLoading: isRecordsLoading,
    isError: isRecordsError,
    refetch: refetchRecords
  } = useQuery<MedicalRecordFormData[]>({
    queryKey: ['medicalRecords'],
    queryFn: async () => {
      try {
        const response = await getRequest("/HealthMetric/retrieve/all", {});
        return response.data || [];
      } catch (error) {
        throw new Error(
          error instanceof Error 
            ? error.message 
            : "Failed to fetch medical records"
        );
      }
    },
    enabled: activeView === 'history',
    retry: 2,
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  });

  // Record submission mutation
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
      // Trigger records refetch
      refetchRecords();
      
      // Reset form
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

  // Event Handlers
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

  // Navigation and Dialog Handlers
  const navigateToHistory = () => {
    setActiveView('history');
    setShowSuccessDialog(false);
  };

  const addAnotherRecord = () => {
    setShowSuccessDialog(false);
  };

  // Render Form View
  const renderFormView = () => (
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
              onClick={() => setActiveView('history')}
            >
              View Records History
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  // Render History View
  const renderHistoryView = () => {
    if (isRecordsLoading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Medical Records History</CardTitle>
          </CardHeader>
          <CardContent>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      );
    }

    if (isRecordsError) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Medical Records History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-red-500">
              <p>Unable to load medical records. Please try again later.</p>
              <Button 
                onClick={() => setActiveView('form')} 
                className="mt-4"
              >
                Return to Form
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Medical Records History</CardTitle>
          <Button 
            variant="outline" 
            onClick={() => setActiveView('form')}
            className="absolute top-4 right-4"
          >
            Add New Record
          </Button>
        </CardHeader>
        <CardContent>
          {medicalRecords.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No medical records found.</p>
              <Button 
                onClick={() => setActiveView('form')} 
                className="mt-4"
              >
                Add First Record
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Medications</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {record.createdAt 
                          ? new Date(record.createdAt).toLocaleDateString() 
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{record.age}</TableCell>
                      <TableCell>{record.gender}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>{record.medication}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast.info(`Viewing details for record ${record.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Success Dialog
  const renderSuccessDialog = () => (
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
  );

  return (
    <div className={cn("flex flex-col gap-6")}>
      {activeView === 'form' ? renderFormView() : renderHistoryView()}
      {renderSuccessDialog()}
    </div>
  );
};

export default MedicalRecordsPage;