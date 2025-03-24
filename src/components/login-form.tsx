"use client";

import { useState } from "react";
import type React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/registry/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/registry/input";
import { Label } from "@/components/ui/label";
import FlashScreen from "@/components/flashScreen"; // Import FlashScreen
import Image from "next/image"; // Import Next.js Image component
import Logo from "../../public/Vytrack.png";

const LoginForm: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const [showFlashScreen, setShowFlashScreen] = useState(true);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {showFlashScreen ? (
        <FlashScreen onComplete={() => setShowFlashScreen(false)} />
      ) : (
        <>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your Vy-tracker account
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
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
                    <Input id="password" type="password" required />
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => router.push("/dashboard")}
                  >
                    Login
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
                    <button
                      type="button"
                      className="underline underline-offset-4 text-blue-600"
                      onClick={() => router.push("/register")}
                    >
                      Sign up
                    </button>
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
