"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ArrowLeft } from "lucide-react";
import { formatESPNScores } from "@/lib/utils";
import { Scoreboard } from "@/components/ScoreBoard";
import { ScoreboardProps } from "@/components/ScoreBoard/types";


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
  const teamId = localStorage.getItem("team_id") as string;
  const [loading, setLoading] = useState(true);
  const [parsedData, setParsedData] = useState<ScoreboardProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoxScore = async () => {
      try {
        setLoading(true);
        console.log("[v0] Fetching box score for teamId:", teamId);

        const response = await fetch(

          `https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/schedule`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();


        const lastMatchs = data.events.filter((e: any) =>
            e.competitions[0].status.type.name === "STATUS_FINAL"
        ).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

        let parsedMatchs: any[] = [];

        for (const match of lastMatchs) {
            const response = await fetch(
                `https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${match.id}`
            );
            const matchData = await response.json();
            parsedMatchs.push(matchData);
        }

        // console.log("[v0] Box score API response:", parsedMatchs);

        // console.log("[v0] Box score API response:", formatESPNScores(parsedMatchs));

        setParsedData(formatESPNScores(parsedMatchs));
        setError(null);
      } catch (err) {
        console.log("[v0] Error fetching box score:", err);
        setError("No se pudo cargar el box score del partido");
      } finally {
        setLoading(false);
      }
    };

    fetchBoxScore();
  }, [teamId]);

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
        {parsedData && parsedData.map(game => <Scoreboard key={game.gameId} {...game} />)}
      </div>
    </main>
  );
}
