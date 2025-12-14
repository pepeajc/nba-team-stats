"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ArrowLeft } from "lucide-react";
import { useRouteStorage } from "@/hooks/use-route-storage";

interface PlayerStats {
  playerName: string;
  playerId: string;
  position: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fieldGoalsMade: string;
  threePointersMade: string;
  freeThrowsMade: string;
  minutesPlayed: number;
}

interface GameBoxScore {
  gameId: string;
  homeTeam: {
    name: string;
    abbreviation: string;
    score: number;
    players: PlayerStats[];
  };
  awayTeam: {
    name: string;
    abbreviation: string;
    score: number;
    players: PlayerStats[];
  };
  gameTime: string;
  status: string;
}

export default function BoxScorePage() {
  const gameId = localStorage.getItem("game_id") as string;
  const [boxScore, setBoxScore] = useState<GameBoxScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { goToPlayer } = useRouteStorage();

  useEffect(() => {
    const fetchBoxScore = async () => {
      try {
        setLoading(true);
        console.log("[v0] Fetching box score for gameId:", gameId);

        const response = await fetch(
          `https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${gameId}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("[v0] Box score API response:", data);

        const formattedBoxScore = formatBoxScore(data, gameId);
        console.log("[v0] Formatted box score:", formattedBoxScore);

        setBoxScore(formattedBoxScore);
        setError(null);
      } catch (err) {
        console.log("[v0] Error fetching box score:", err);
        setError("No se pudo cargar el box score del partido");
      } finally {
        setLoading(false);
      }
    };

    fetchBoxScore();
  }, [gameId]);

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

  if (error || !boxScore) {
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
          href="/"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft size={20} />
          Volver a partidos
        </Link>

        {/* Game Header */}
        <Card className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Away Team */}
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">VISITANTE</p>
              <h2 className="text-3xl font-bold text-white mb-2">
                {boxScore.awayTeam.name}
              </h2>
              <p className="text-5xl font-bold text-yellow-400">
                {boxScore.awayTeam.score}
              </p>
            </div>

            {/* Game Info */}
            <div className="text-center">
              <p className="text-slate-400 text-sm">{boxScore.status}</p>
              <p className="text-slate-300 text-xs mt-1">{boxScore.gameTime}</p>
            </div>

            {/* Home Team */}
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">LOCAL</p>
              <h2 className="text-3xl font-bold text-white mb-2">
                {boxScore.homeTeam.name}
              </h2>
              <p className="text-5xl font-bold text-yellow-400">
                {boxScore.homeTeam.score}
              </p>
            </div>
          </div>
        </Card>

        {/* Box Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Away Team Players */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              {boxScore.awayTeam.name}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 font-semibold py-3 px-2">
                      Jugador
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      Min
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      Pts
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      Reb
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      Ast
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      FG
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      3PT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {boxScore.awayTeam.players.map((player, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-800 hover:bg-slate-800/30"
                    >
                      <td className="text-white py-3 px-2">
                        <p className="font-semibold">
                          <a
                            href="#"
                            title={player.playerName}
                            onClick={(e) => {
                              e.preventDefault();
                              goToPlayer(player.playerId, player.playerName);
                            }}
                          >
                            {player.playerName}
                          </a>
                        </p>
                      </td>
                      <td className="text-center text-slate-300 py-3 px-2">
                        {player.minutesPlayed}
                      </td>
                      <td className="text-center text-yellow-400 font-bold py-3 px-2">
                        {player.points}
                      </td>
                      <td className="text-center text-slate-300 py-3 px-2">
                        {player.rebounds}
                      </td>
                      <td className="text-center text-slate-300 py-3 px-2">
                        {player.assists}
                      </td>
                      <td className="text-center text-slate-300 py-3 px-2">
                        {player.fieldGoalsMade}
                      </td>
                      <td className="text-center text-slate-300 py-3 px-2">
                        {player.threePointersMade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Home Team Players */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              {boxScore.homeTeam.name}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 font-semibold py-3 px-2">
                      Jugador
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      Min
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      Pts
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      Reb
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      Ast
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      FG
                    </th>
                    <th className="text-center text-slate-400 font-semibold py-3 px-2">
                      3PT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {boxScore.homeTeam.players.map((player, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-800 hover:bg-slate-800/30"
                    >
                      <td className="text-white py-3 px-2">
                        <p className="font-semibold">
                          <a
                            href="#"
                            title={player.playerName}
                            onClick={(e) => {
                              e.preventDefault();
                              goToPlayer(player.playerId, player.playerName);
                            }}
                          >
                            {player.playerName}
                          </a>
                        </p>
                      </td>
                      <td className="text-center text-slate-300 py-3 px-2">
                        {player.minutesPlayed}
                      </td>
                      <td className="text-center text-yellow-400 font-bold py-3 px-2">
                        {player.points}
                      </td>
                      <td className="text-center text-slate-300 py-3 px-2">
                        {player.rebounds}
                      </td>
                      <td className="text-center text-slate-300 py-3 px-2">
                        {player.assists}
                      </td>
                      <td className="text-center text-slate-300 py-3 px-2">
                        {player.fieldGoalsMade}
                      </td>
                      <td className="text-center text-slate-300 py-3 px-2">
                        {player.threePointersMade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function formatBoxScore(data: any, gameId: string): GameBoxScore {
  console.log("[v0] formatBoxScore called, data keys:", Object.keys(data));

  const boxscore = data.boxscore;
  if (!boxscore || !boxscore.teams || boxscore.teams.length < 2) {
    console.log("[v0] No boxscore or teams found in response");
    return null as any;
  }

  const teams = boxscore.teams;
  const homeTeam = teams.find((team: any) => team.homeAway === "home");
  const awayTeam = teams.find((team: any) => team.homeAway === "away");

  const homeTeamStatistics = boxscore.players.find(
    (p: any) => p.team.id === homeTeam.team.id
  ).statistics[0];
  const awayTeamStatistics = boxscore.players.find(
    (p: any) => p.team.id === awayTeam.team.id
  ).statistics[0];

  console.log(
    "[v0] Home team:",
    homeTeam?.team?.displayName,
    "Away team:",
    awayTeam?.team?.displayName
  );
  console.log("[v0] Home team full structure keys:", Object.keys(homeTeam));
  console.log(
    "[v0] Home team athletes/players structure:",
    JSON.stringify(homeTeam).substring(0, 1000)
  );

  const getTeamScore = (stats: any): number => {
    const pointsStat = stats.totals[1];
    if (pointsStat) {
      return Number.parseInt(pointsStat);
    }
    return 0;
  };

  const formatPlayers = (team: any, teamIndex: number): PlayerStats[] => {
    const players: PlayerStats[] = [];

    const playerArray =
      team.players || team.athletes || team.competitors?.athletes || [];

    console.log(
      "[v0] Team index",
      teamIndex,
      "player array found:",
      Array.isArray(playerArray),
      "length:",
      playerArray.length
    );
    console.log("[v0] Team structure keys:", Object.keys(team));

    const statsLabels = team.labels || [
      "MIN",
      "PTS",
      "FG",
      "3PT",
      "FT",
      "REB",
      "AST",
      "TO",
      "STL",
      "BLK",
      "OREB",
      "DREB",
      "PF",
      "+/-",
    ];

    // "keys": [
    //   "minutes",
    //   "points",
    //   "fieldGoalsMade-fieldGoalsAttempted",
    //   "threePointFieldGoalsMade-threePointFieldGoalsAttempted",
    //   "freeThrowsMade-freeThrowsAttempted",
    //   "rebounds",
    //   "assists",
    //   "turnovers",
    //   "steals",
    //   "blocks",
    //   "offensiveRebounds",
    //   "defensiveRebounds",
    //   "fouls",
    //   "plusMinus"
    // ],

    if (Array.isArray(playerArray) && playerArray.length > 0) {
      playerArray.forEach((player: any) => {
        // Extraer estadísticas del jugador
        const stats = player.statistics || [];
        const statsMap: any = {};

        stats.forEach((s: any) => {
          statsMap[s.name] = s.displayValue;
        });

        players.push({
          playerId: player.athlete?.id || "Unknown",
          playerName: player.athlete?.displayName || "Unknown",
          position: player.athlete?.position?.displayName || "-",
          points:
            Number.parseInt(player.stats[statsLabels.indexOf("PTS")] || "0") ||
            0,
          rebounds:
            Number.parseInt(player.stats[statsLabels.indexOf("REB")] || "0") ||
            0,
          assists:
            Number.parseInt(player.stats[statsLabels.indexOf("AST")] || "0") ||
            0,
          steals:
            Number.parseInt(player.stats[statsLabels.indexOf("STL")] || "0") ||
            0,
          blocks:
            Number.parseInt(player.stats[statsLabels.indexOf("BLK")] || "0") ||
            0,
          fieldGoalsMade: player.stats[statsLabels.indexOf("FG")] || "0",
          threePointersMade: player.stats[statsLabels.indexOf("3PT")] || "0",
          freeThrowsMade: player.stats[statsLabels.indexOf("FT")] || "0",
          minutesPlayed:
            Number.parseInt(player.stats[statsLabels.indexOf("MIN")] || "0") ||
            0,
        });
      });

      if (players.length > 0) {
        console.log(
          "[v0] Extracted",
          players.length,
          "players for team",
          teamIndex
        );
        return players;
      }
    }

    console.log("[v0] No players data found in team, using example players");
    return [];
  };

  const status = data.article?.status?.type?.name || "unknown";
  let statusText = "Programado";
  if (status.includes("live")) statusText = "En Vivo";
  else if (status.includes("final")) statusText = "Final";

  return {
    gameId,
    homeTeam: {
      name: homeTeam?.team?.displayName || "Unknown",
      abbreviation: homeTeam?.team?.abbreviation || "???",
      score: getTeamScore(homeTeamStatistics),
      players: formatPlayers(homeTeamStatistics, 0),
    },
    awayTeam: {
      name: awayTeam?.team?.displayName || "Unknown",
      abbreviation: awayTeam?.team?.abbreviation || "???",
      score: getTeamScore(awayTeamStatistics),
      players: formatPlayers(awayTeamStatistics, 1),
    },
    gameTime: data.article?.date
      ? new Date(data.article.date).toLocaleString("es-MX")
      : new Date().toLocaleString("es-MX"),
    status: statusText,
  };
}
