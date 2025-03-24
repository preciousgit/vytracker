"use client"; // ✅ Ensure this is at the top without spaces before imports

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/registry/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/registry/input";
import { Label } from "@/components/ui/label";
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
import { useRouter } from "next/navigation"; // ✅ Correct import
import FlashScreen from "@/components/flashScreen"; // Import FlashScreen

export function RegisterForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    weight: "",
    temperature: "",
    pulseRate: "",
    respiratoryRate: "",
    password: "",
    confirmPassword: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showFlashScreen, setShowFlashScreen] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission triggered!");

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        console.log("Registration successful!");
        setShowPopup(true);
      } else {
        console.error("Registration failed:", data);
        alert(`Registration failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error instanceof Error) {
        alert(`Error during registration: ${error.message}`);
      } else {
        alert("An unknown error occurred during registration.");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {showFlashScreen ? (
        <FlashScreen onComplete={() => setShowFlashScreen(false)} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Patient Registration</CardTitle>
              <CardDescription>
                Fill in your details to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, gender: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4">
                  Register
                </Button>
                <p className="text-center mt-4 text-sm">
                  Already have an account?
                  <button
                    type="button"
                    className="underline underline-offset-4 text-blue-600"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* ✅ Success Popup using ShadCN Dialog */}
          <Dialog open={showPopup} onOpenChange={setShowPopup}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-center">
                  🎉 Registration Successful!
                </DialogTitle>
              </DialogHeader>
              <p className="text-center text-gray-600">
                You have successfully signed up.
              </p>
              <Button
                className="w-full mt-4"
                onClick={() => router.push("/login")}
              >
                Return to Login
              </Button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
