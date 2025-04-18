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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    setToken(tokenParam);

    // 1. 전체 랭킹 가져오기
    fetch("/api/cheese")
      .then((res) => res.json())
      .then((data: CheeseRecord[]) => setRanking(data))
      .catch(console.error);

    // 2. 내 점수 + 순위 가져오기
    if (tokenParam) {
      fetch(`/api/cheese?token=${tokenParam}`)
        .then((res) => res.json())
        .then((data) => {
          setMyCheese(data.cheese ?? 0);
          setMyRank(data.rank ?? null);
        })
        .catch(console.error);
    }
  }, []);

  return (
    <div className="mt-10 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-yellow-600 mb-4">
        🥇 Top 10 Cheese Rankings
      </h2>
      <ul className="bg-white rounded-xl shadow overflow-hidden divide-y divide-gray-200">
        {ranking.map((r, i) => (
          <li key={i} className="flex justify-between px-4 py-2">
            <span className="font-medium">
              {i + 1}. {r.nickname}
            </span>
            <span className="font-mono text-yellow-700">{r.cheese} 🧀</span>
          </li>
        ))}
      </ul>

      {myCheese !== null && (
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded text-center">
          <span className="block font-semibold text-yellow-700">
            💛 Your Cheese: {myCheese}
          </span>
          {myRank !== null && (
            <span className="block text-sm text-gray-600 mt-1">
              🎖️ Your Rank: #{myRank}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
