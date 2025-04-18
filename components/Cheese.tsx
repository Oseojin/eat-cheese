"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const cheeseImages = [
  "/images/cheese_0.png",
  "/images/cheese_1.png",
  "/images/cheese_2.png",
  "/images/cheese_3.png",
];

export default function Cheese() {
  const [biteCount, setBiteCount] = useState(0);
  const [cheese, setCheese] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  // 1. 쿼리스트링에서 token, nickname 추출
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const nicknameParam = params.get("nickname");
    setToken(tokenParam);
    setNickname(nicknameParam);

    // 2. 서버에서 기존 cheese 점수 불러오기
    if (tokenParam) {
      fetch(`/api/cheese?token=${tokenParam}`)
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.cheese === "number") {
            setCheese(data.cheese);
          }
        })
        .catch((err) => console.error("Failed to load cheese:", err));
    }
  }, []);

  // 3. 서버에 점수 저장
  const saveCheese = async (token: string, nickname: string) => {
    try {
      const res = await fetch("/api/cheese", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nickname }),
      });

      if (!res.ok) throw new Error("Failed to save cheese");
    } catch (err) {
      console.error(err);
    }
  };

  // 4. 클릭 로직
  const handleClick = async () => {
    const nextBite = biteCount < 3 ? biteCount + 1 : 0;
    setBiteCount(nextBite);

    if (biteCount === 2 && token && nickname) {
      const nextCheese = cheese + 1;
      setCheese(nextCheese);
      await saveCheese(token, nickname);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Image
        src={cheeseImages[biteCount]}
        alt="치즈"
        width={400}
        height={400}
        onClick={handleClick}
        className="cursor-pointer select-none"
      />
      <div className="mt-4 text-xl font-bold text-yellow-600">
        Cheese: {cheese}
      </div>
    </div>
  );
}
