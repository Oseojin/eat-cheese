"use client";

import Image from "next/image";
import { useState } from "react";

const cheeseImages = [
  "/images/cheese_0.png",
  "/images/cheese_1.png",
  "/images/cheese_2.png",
  "/images/cheese_3.png",
];

const saveCheeseScore = async (nickname: string, score: number) => {
  try {
    const res = await fetch("/api/cheese", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname, score }),
    });

    if (!res.ok) {
      throw new Error("Failed to save score");
    }

    console.log("Score saved!");
  } catch (error) {
    console.error("Error saving score:", error);
  }
};

export default function Cheese() {
  const [biteCount, setBiteCount] = useState(0); // 0,1,2,3
  const [cheese, setCheese] = useState(0);

  const handleClick = async () => {
    if (biteCount < 3) {
      setBiteCount(biteCount + 1);
    } else {
      setBiteCount(0);
    }

    if (biteCount === 2) {
      const nextCheese = cheese + 1;
      setCheese(nextCheese);

      // 저장 요청 (닉네임은 예시, 나중에 사용자 입력이나 로그인 연결 가능)
      await saveCheeseScore("guest", nextCheese);
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
        Cheese: {cheese}
      </div>
    </div>
  );
}
