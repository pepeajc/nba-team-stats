"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ArrowLeft } from "lucide-react";

type PlayerData = {
  displayName?: string;
  age?: number;
  position?: {
    displayName?: string;
  };
  // add other properties as needed
};

function getJSONField(obj: any, field: string): any {
  if (obj && typeof obj === "object") {
    if (field in obj) return obj[field];

    for (const key in obj) {
      const result = getJSONField(obj[key], field);
      if (result !== undefined) return result;
    }
  }
}

export default function playerPage() {
  const playerId = localStorage.getItem("player_id") as string;
  const [loading, setLoading] = useState(true);
  const [parsedData, setParsedData] = useState<PlayerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoxScore = async () => {
      try {
        setLoading(true);
        console.log("[v0] Fetching box score for playerId:", playerId);

        const response = await fetch(
          `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/athletes/${playerId}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("[v0] Box score API response:", data);

        setParsedData(data);
        setError(null);
      } catch (err) {
        console.log("[v0] Error fetching box score:", err);
        setError("No se pudo cargar el box score del partido");
      } finally {
        setLoading(false);
      }
    };

    fetchBoxScore();
  }, [playerId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <MainNav />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <MainNav />
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft size={20} />
            Volver a partidos
          </Link>
          <Card className="p-8 bg-slate-800/50 border-slate-700">
            <p className="text-red-400">{error}</p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="#"
          onClick={() => history.back()}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft size={20} />
          Volver a partidos
        </Link>
        <Card className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-700 mb-8">
          <div className="grid grid-cols-1 gap-1 justify-items-center">
            {/* Away Team */}
            <p className="text-slate-400 text-sm mb-2">JUGADOR</p>
            <img
              src={getJSONField(parsedData, "headshot")?.href}
              alt={parsedData?.displayName}
              className="w-50 h-50 object-cover rounded-[100%] border-amber-300 border-4"
            />
            <h2 className="text-3xl font-bold text-white mb-2">
              {parsedData?.displayName}
            </h2>
            <p className="text-5xl font-bold text-yellow-400">
              {parsedData?.position?.displayName}
            </p>
            <p className="text-5xl font-bold text-yellow-400">
              {getJSONField(parsedData, "jersey")}
            </p>
          </div>
        </Card>
        {/* Game Info */}
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Edad: {getJSONField(parsedData, "age")}
          </p>
          <p className="text-slate-400 text-sm">
            Años activo: {getJSONField(parsedData, "years")}
          </p>
          <p className="text-slate-400 text-sm">
            Años debut: {getJSONField(parsedData, "debutYear")}
          </p>
          <p className="text-slate-300 text-xs mt-1">
            Altura: {getJSONField(parsedData, "displayHeight")}
          </p>
          <p className="text-slate-300 text-xs mt-1">
            Peso: {getJSONField(parsedData, "displayWeight")}
          </p>
          <p>Pais: {getJSONField(parsedData, "country")}</p>
        </div>
      </div>
    </main>
  );
}
