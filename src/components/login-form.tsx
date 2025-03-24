"use client";

import { useState } from "react";
import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FlashScreen from "@/components/flashScreen";
import Image from "next/image";
import Logo from "../../public/Vytrack.png";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Define the login schema
const loginSchema = yup.object().shape({
  email: yup.string().email('Provide a valid email address').required("Email is required"),
  password: yup.string().required('Password is required'),
});

// Define the type for login data
type LoginFormData = {
  email: string;
  password: string;
};

const LoginForm: React.FC<{ className?: string }> = ({ className }) => {
  const [showFlashScreen, setShowFlashScreen] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  // Set up the mutation with proper type handling
  const mutation = useMutation<unknown, Error & { response?: { data?: string } }, LoginFormData>({
    mutationFn: async (data: LoginFormData) => {
      const response = await postRequest("/Auth/create/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Login successful");
      
      // If the response contains token or user data, store it in sessionStorage
      if (data && typeof data === 'object') {
        // Store any necessary authentication data
        if ('token' in data) {
          sessionStorage.setItem('authToken', data.token as string);
        }
        
        if ('userData' in data) {
          sessionStorage.setItem('userData', JSON.stringify(data.userData));
        }
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
      
      reset(); // Reset form
    },
    onError: (error) => { 
      toast.error(error?.response?.data || "An error occurred");
    }
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {showFlashScreen ? (
        <FlashScreen onComplete={() => setShowFlashScreen(false)} />
      ) : (
        <>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
<<<<<<< HEAD
                      Login to your Vytracker account
=======
                      Login to your Vy-tracker account
>>>>>>> 155e23fe1d2cfcae403ef98c2490e4e762c524e9
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email")}
                      required
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        className="ml-auto text-sm underline-offset-2 hover:underline text-blue-600"
                        onClick={() =>
                          alert(
                            "Forgot password functionality not implemented yet"
                          )
                        }
                      >
                        Forgot your password?
                      </button>
                    </div>
                    <div>
                    <Input 
                      id="password" 
                      type="password" 
                      {...register("password")}
                      required 
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                   >
                    {mutation.isPending ? 'Logging in...' : 'Login'}
                  </Button>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="w-full">
                      Apple
                    </Button>
                    <Button variant="outline" className="w-full">
                      Google
                    </Button>
                    <Button variant="outline" className="w-full">
                      Meta
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="underline underline-offset-4 text-blue-600"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <Image
                  src={Logo}
                  alt="Vytrack Logo"
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 h-full w-full dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <a href="/terms-of-service">Terms of Service</a> and{" "}
            <a href="/privacy-policy">Privacy Policy</a>.
          </div>
        </>
      )}
    </div>
  );
};

export default LoginForm;