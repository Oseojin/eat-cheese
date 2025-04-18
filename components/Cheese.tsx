"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const cheeseImages = [
  "/images/cheese_0.png",
  "/images/cheese_1.png",
  "/images/cheese_2.png",
  "/images/cheese_3.png",
];

const soundList = Array.from(
  { length: 10 },
  (_, i) => `/sounds/cheese${i + 1}.mp3`
);

export default function Cheese() {
  const [biteCount, setBiteCount] = useState(0);
  const [cheese, setCheese] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const audioRefs = useRef<HTMLAudioElement[]>([]);

  // 사운드 초기화
  useEffect(() => {
    audioRefs.current = soundList.map((src) => new Audio(src));
  }, []);

  // 토큰, 닉네임, 초기 점수
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const nicknameParam = params.get("nickname");
    setToken(tokenParam);
    setNickname(nicknameParam);

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

  const playRandomSound = () => {
    const randomIndex = Math.floor(Math.random() * audioRefs.current.length);
    const sound = audioRefs.current[randomIndex];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(console.error);
    }
  };

  const handleClick = async () => {
    const nextBite = biteCount < 3 ? biteCount + 1 : 0;
    setBiteCount(nextBite);
    // 애니메이션 + 사운드
    setIsShaking(true);
    playRandomSound();
    setTimeout(() => setIsShaking(false), 300);

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
        className={`cursor-pointer select-none transition-transform duration-300 ${
          isShaking ? "animate-shake" : ""
        }`}
      />
      <div className="mt-4 text-xl font-bold text-yellow-600">
        Cheese: {cheese}
      </div>
    </div>
  );
}
