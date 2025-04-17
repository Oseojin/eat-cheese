"use client";

import Image from "next/image";
import { useState } from "react";

const cheeseImages = [
  "/images/cheese_0.png",
  "/images/cheese_1.png",
  "/images/cheese_2.png",
];

export default function Cheese() {
  const [biteCount, setBiteCount] = useState(0); // 0,1,2
  const [score, setScore] = useState(0);

  const handleClick = () => {
    if (biteCount < 2) {
      setBiteCount(biteCount + 1);
    } else {
      setBiteCount(0);
      setScore(score + 1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Image
        src={cheeseImages[biteCount]}
        alt="치즈"
        width={200}
        height={200}
        onClick={handleClick}
        className="cursor-pointer select-none"
      />
      <div className="mt-4 text-xl font-bold text-yellow-600">
        점수: {score}
      </div>
    </div>
  );
}
