"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/registry/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import slide1 from "../../public/slide1.png";
import slide2 from "../../public/slide2.png";
import slide3 from "../../public/slide3.png";
import logo from "../../public/Vytrack.png";
import { useRouter } from "next/navigation";

const slides = [
  { id: 1, image: slide1, caption: "Track Your Health Records Easily" },
  { id: 2, image: slide2, caption: "Connect with Verified Doctors" },
  { id: 3, image: slide3, caption: "Set Appointments & Medication Reminders" },
];

export default function Onboarding() {
  const plugin = useRef(Autoplay({ delay: 2800, stopOnInteraction: false }));
  const router = useRouter();

  return (
    <div className="relative h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col justify-center px-14 bg-white-900 text-black relative">
        {/* Logo */}
        <Image
          src={logo}
          alt="Vy-Tracker Logo"
          width={80}
          height={10}
          className="absolute top-1 left-11"
        />

        <h1 className="text-4xl font-bold mb-6">
          Welcome to Vy-Tracker – Your Health Companion!
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Your Health, Simplified</h2>
        <p className="text-lg mb-6">
          Ever felt so unwell that you needed a doctor immediately? Ever
          wondered what your health records say about you? Worry less—Vy-Tracker
          is here to assist you with everything health-related.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Why Choose Vy-Tracker?</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            ✅ Track Your Health Records – Stay on top of your medical history
            effortlessly.
          </li>
          <li className="flex items-center gap-2">
            ✅ Get Professional Assistance – Connect with verified doctors for
            expert care.
          </li>
          <li className="flex items-center gap-2">
            ✅ Seamless Appointment Scheduling – Set up consultations with ease.
          </li>
          <li className="flex items-center gap-2">
            ✅ Smart Medication Reminders – Never miss a dose again.
          </li>
        </ul>

        {/* Updated Button with Blue Color */}
        <Button
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => router.push("/login")}
        >
          Let’s get started!
        </Button>
      </div>

      {/* Right Section - Carousel */}
      <div className="w-1/2 relative bg-white flex items-center justify-center">
        <Carousel plugins={[plugin.current]} className="w-[90%]">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="flex justify-center">
                <Card className="shadow-none border-none">
                  <CardContent className="p-0">
                    <Image
                      src={slide.image}
                      alt={slide.caption}
                      width={3000}
                      height={2000}
                      className="w-full h-auto object-cover"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
