"use client";
import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FlashScreen from "@/components/flashScreen";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useRouter } from "next/navigation";
import Image from "next/image";

// Schema and Yup
  const registrationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  middleName: yup.string(),
  lastName: yup.string().required("Last name is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  phoneNumber: yup.string().required("Phone Number is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  profilePicture: yup.mixed(),
});

type RegistrationFormData = yup.InferType<typeof registrationSchema>;

// Use React.ComponentPropsWithoutRef
export const RegisterForm: FC<React.ComponentPropsWithoutRef<"div">> = ({ className, ...props }) => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [showFlashScreen, setShowFlashScreen] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Query mutation
  const mutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      // Using destructuring
      const { profilePicture, ...submitData } = data;
      
      // Create FormData for file upload
      const formData = new FormData();
  
      Object.entries(submitData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
          
      // Add profile picture if exists
      if (profilePicture && profilePicture[0]) {
        formData.append('profilePicture', profilePicture[0]);
      }
      
      try {
        // Log the data being sent
        console.log("Submitting data:", Object.fromEntries(formData.entries()));
        
        const response = await postRequest(
          "/Auth/patient/registration", 
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
      } catch (error: unknown) {
        console.log("Full error response:", error);
     
        if (error && typeof error === 'object' && 'response' in error) {
          const errorResponse = (error as { response?: { data?: unknown } }).response;
          if (errorResponse?.data) {
            const errorData = errorResponse.data;
            throw new Error(
              typeof errorData === 'string' 
                ? errorData 
                : typeof errorData === 'object' && errorData !== null && 'message' in errorData
                  ? String(errorData.message)
                  : "Registration failed"
            );
          }
        }
        throw new Error("Registration failed. Please try again later.");
      }
    },
    onSuccess: () => {
      // Updated success toast message
      toast.success("Registration successful! Please check your email to verify your account.");
      setShowPopup(true);
      reset();
      setProfileImage(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred during registration");
      console.error("Registration error:", error);
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    mutation.mutate(data);
  };

  const handleGenderChange = (value: string) => {
    setValue("gender", value);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Register the file with the form
      setValue("profilePicture", e.target.files);
      
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setProfileImage(url);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setValue("profilePicture", undefined);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFlashScreen(false);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      // Clean up any created object URLs
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

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
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <div 
                      className={cn(
                        "w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden mb-2",
                        "bg-gray-100"
                      )}
                    >
                      {profileImage ? (
                        <Image 
                          src={profileImage} 
                          alt="Profile Preview" 
                          width={96} 
                          height={96} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-12 w-12 text-gray-400" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                          />
                        </svg>
                      )}
                    </div>
                    {profileImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                    ref={fileInputRef}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Photo
                  </Button>
                </div>
                {/* Update each input with proper attributes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      aria-invalid={errors.firstName ? "true" : "false"}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      {...register("middleName")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      aria-invalid={errors.lastName ? "true" : "false"}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                      aria-invalid={errors.dateOfBirth ? "true" : "false"}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={handleGenderChange}>
                      <SelectTrigger
                        aria-invalid={errors.gender ? "true" : "false"}
                      >
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="string"
                      {...register("phoneNumber")}
                      aria-invalid={errors.phoneNumber ? "true" : "false"}
                    />
                      {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.phoneNumber?.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
<<<<<<< HEAD
                      {...register("email")}
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
=======
                      required
                      onChange={handleChange}
                    />
>>>>>>> 155e23fe1d2cfcae403ef98c2490e4e762c524e9
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      aria-invalid={errors.password ? "true" : "false"}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                      aria-invalid={errors.confirmPassword ? "true" : "false"}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-4"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Registering..." : "Register"}
                </Button>
                <p className="text-center mt-4 text-sm">
<<<<<<< HEAD
                  Already have an account?{" "}
=======
                  Already have an account?
>>>>>>> 155e23fe1d2cfcae403ef98c2490e4e762c524e9
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

          {/* Updated Popup dialog with email verification message */}
          <Dialog open={showPopup} onOpenChange={setShowPopup}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-center">
                  🎉 Registration Successful!
                </DialogTitle>
              </DialogHeader>
              <div className="text-center text-gray-600">
                <p className="mb-2">
                  You have successfully signed up.
                </p>
                <p className="font-medium text-blue-600">
                  Please check your email to verify your account before logging in.
                </p>
              </div>
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
};