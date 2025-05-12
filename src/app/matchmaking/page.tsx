"use client";

import { useEffect, useState } from "react";

export default function MatchmakingPage() {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec < 10 ? "0" : ""}${sec}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-950 text-white p-10 gap-8">
      <h1 className="text-4xl font-bold">Recherche de partie...</h1>
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
      <p className="text-lg text-gray-300">Temps écoulé : {formatTime(timer)}</p>
      <p className="text-sm text-gray-500">Estimation : 1m 58s</p>
    </div>
  );
}