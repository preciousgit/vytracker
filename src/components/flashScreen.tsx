"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Logo from "../../public/Vytrack.png";

export default function FlashScreen({
  onComplete,
}: Readonly<{
  onComplete: () => void;
}>) {
  const [visible, setVisible] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true); // Start animation on mount

    const timer = setTimeout(() => {
      setAnimate(false); // Prepare for fade-out
      setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 500); // Match fade-out duration
    }, Math.random() * (5000 - 2000) + 2000); // 2 to 5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <Image
        src={Logo}
        alt="Flash Screen"
        width={150} // Adjust the width as needed
        height={150} // Adjust the height as needed
        className={`transition-all duration-500 ${
          animate ? "opacity-100 scale-100" : "opacity-0 scale-60"
        } breath-animation`}
      />
    </div>
  );
}
