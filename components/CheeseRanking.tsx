"use client";

import { useEffect, useState } from "react";

type CheeseRecord = {
  nickname: string;
  cheese: number;
  createdAt: string;
};

export default function CheeseRanking() {
  const [ranking, setRanking] = useState<CheeseRecord[]>([]);
  const [myCheese, setMyCheese] = useState<number | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const nicknameParam = params.get("nickname");
    setNickname(nicknameParam);

    const fetchMyScore = async () => {
      if (tokenParam) {
        const res = await fetch(`/api/cheese?token=${tokenParam}`);
        const data = await res.json();
        setMyCheese(data.cheese ?? 0);
        setMyRank(data.rank ?? null);
      }
    };

    const fetchRanking = async () => {
      const res = await fetch("/api/cheese");
      const data = await res.json();
      setRanking(data);
    };

    fetchMyScore();
    fetchRanking();

    // 5초마다 전체 랭킹 새로고침
    const interval = setInterval(() => {
      fetchRanking();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-yellow-600 mb-4">
        🥇 Top 10 Cheese Rankings
      </h2>
      <ul className="bg-white rounded-xl shadow overflow-hidden divide-y divide-gray-200">
        {ranking.map((r, i) => {
          const isMe = nickname && r.nickname === nickname;
          return (
            <li
              key={i}
              className={`flex justify-between px-4 py-2 ${
                isMe ? "bg-yellow-100 font-bold text-yellow-700" : ""
              }`}
            >
              <span>
                {i + 1}. {r.nickname}
              </span>
              <span className="font-mono">{r.cheese} 🧀</span>
            </li>
          );
        })}
      </ul>

      {myCheese !== null && (
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded text-center">
          {myRank !== null ? (
            <span className="block text-sm text-gray-600 mt-1">
              🎖️ Your Rank: #{myRank}
            </span>
          ) : (
            <span className="block text-sm text-gray-500 mt-1">
              You are not on the leaderboard yet
            </span>
          )}
        </div>
      )}
    </div>
  );
}
