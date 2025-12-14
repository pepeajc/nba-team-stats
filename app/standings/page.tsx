"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { LoadingSpinner } from "@/components/loading-spinner";

interface TeamStanding {
  teamId: string;
  teamName: string;
  teamTricode: string;
  wins: number;
  losses: number;
  winPct: number;
  logo?: {
    href: string;
    whidth: number;
    height: number;
  };
}

interface ConferenceStanding {
  conference: string;
  teams: TeamStanding[];
}

export default function StandingsPage() {
  const [standings, setStandings] = useState<ConferenceStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        console.log("[v0] Fetching standings from ESPN API");

        const response = await fetch(
          "https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings"
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("[v0] Full API response children count:", data);

        const formattedStandings = formatStandings(data);
        console.log(
          "[v0] Formatted standings:",
          formattedStandings.length,
          "conferences found"
        );

        if (formattedStandings.length > 0) {
          setStandings(formattedStandings);
          setError(null);
        } else {
          console.log("[v0] No standings found, using example data");
          setStandings(getExampleStandings());
        }
      } catch (err) {
        console.error("[v0] Error fetching standings:", err);
        setStandings(getExampleStandings());
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Clasificaciones NBA</h1>
          <p className="text-slate-400 mt-2">Temporada 2024-2025</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {standings.length === 0 ? (
          <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
            <p className="text-slate-400">Mostrando datos de ejemplo</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {standings.map((conf) => (
              <Card
                key={conf.conference}
                className="bg-slate-800/50 border-slate-700 p-6"
              >
                <h2 className="text-xl font-bold text-blue-400 mb-4">
                  {conf.conference} Conference
                </h2>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-400 mb-3 pb-3 border-b border-slate-700">
                    <div className="col-span-6">Team</div>
                    <div className="col-span-2 text-right">W</div>
                    <div className="col-span-2 text-right">L</div>
                    <div className="col-span-2 text-right">PCT</div>
                  </div>

                  {conf.teams.map((team, index) => (
                    <div
                      key={team.teamId}
                      className="grid grid-cols-12 gap-2 py-2 px-2 rounded hover:bg-slate-700/30 transition-colors items-center"
                    >
                      <div className="col-span-6 items-center flex gap-2">
                        
                        <span className="text-slate-300 font-medium">
                          {index + 1}
                        </span>
                         {team.logo && (
                         <img
                            src={team.logo.href}
                            alt={`${team.teamName} logo`}
                            width='30px'
                            height='30px'
                          />
                        )}
                          <span className="text-slate-300 font-medium">
                          {team.teamName}
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-white font-semibold">
                        {team.wins}
                      </div>
                      <div className="col-span-2 text-right text-white font-semibold">
                        {team.losses}
                      </div>
                      <div className="col-span-2 text-right text-blue-300">
                        {team.winPct.toFixed(3)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function formatStandings(leagueData: any): ConferenceStanding[] {
  if (!leagueData || !leagueData.children) {
    console.log("[v0] No children found in leagueData");
    return [];
  }

  const conferences: { [key: string]: TeamStanding[] } = {};

  leagueData.children.forEach((conference: any) => {
    const confName = conference.abbreviation === "East" ? "East" : "West";

    if (!conferences[confName]) {
      conferences[confName] = [];
    }

    const standingsData = conference.standings?.entries || [];

    if (conference.children?.[0]) {
      console.log(
        `[v0] ${confName} conference structure:`,
        JSON.stringify(conference.children[0], null, 2).substring(0, 500)
      );
    }

    console.log(
      `[v0] ${confName} conference has ${standingsData.length} teams`
    );

    standingsData.forEach((entry: any) => {
      const winsObj = entry.stats?.find((s: any) => s.name === "wins");
      const lossesObj = entry.stats?.find((s: any) => s.name === "losses");
      const winPctObj = entry.stats?.find((s: any) => s.name === "winPercent");

      conferences[confName].push({
        teamId: entry.team?.id || "",
        teamName: entry.team?.displayName || "",
        teamTricode: entry.team?.abbreviation || "",
        wins: winsObj?.value || 0,
        losses: lossesObj?.value || 0,
        winPct: winPctObj?.value || 0,
        logo: {
          href: entry.team?.logos?.[0]?.href || "",
          whidth: entry.team?.logos?.[0]?.width || 0,
          height: entry.team?.logos?.[0]?.height || 0,
        },
      });
    });
  });

  const result: ConferenceStanding[] = [];
  const order = ["East", "West"];

  order.forEach((conf) => {
    if (conferences[conf]) {
      result.push({
        conference: conf,
        teams: conferences[conf].sort((a, b) => b.wins - a.wins),
      });
    }
  });

  return result;
}

function getExampleStandings(): ConferenceStanding[] {
  return [
    {
      conference: "East",
      teams: [
        {
          teamId: "25",
          teamName: "Boston Celtics",
          teamTricode: "BOS",
          wins: 20,
          losses: 6,
          winPct: 0.769,
        },
        {
          teamId: "17",
          teamName: "New York Knicks",
          teamTricode: "NYK",
          wins: 18,
          losses: 8,
          winPct: 0.692,
        },
        {
          teamId: "6",
          teamName: "Miami Heat",
          teamTricode: "MIA",
          wins: 16,
          losses: 9,
          winPct: 0.64,
        },
        {
          teamId: "1",
          teamName: "Atlanta Hawks",
          teamTricode: "ATL",
          wins: 15,
          losses: 11,
          winPct: 0.577,
        },
        {
          teamId: "2",
          teamName: "Cleveland Cavaliers",
          teamTricode: "CLE",
          wins: 22,
          losses: 4,
          winPct: 0.846,
        },
      ],
    },
    {
      conference: "West",
      teams: [
        {
          teamId: "10",
          teamName: "Denver Nuggets",
          teamTricode: "DEN",
          wins: 19,
          losses: 6,
          winPct: 0.76,
        },
        {
          teamId: "20",
          teamName: "Oklahoma City Thunder",
          teamTricode: "OKC",
          wins: 22,
          losses: 5,
          winPct: 0.815,
        },
        {
          teamId: "2",
          teamName: "Los Angeles Lakers",
          teamTricode: "LAL",
          wins: 17,
          losses: 8,
          winPct: 0.68,
        },
        {
          teamId: "3",
          teamName: "Golden State Warriors",
          teamTricode: "GSW",
          wins: 16,
          losses: 9,
          winPct: 0.64,
        },
        {
          teamId: "11",
          teamName: "Phoenix Suns",
          teamTricode: "PHX",
          wins: 18,
          losses: 8,
          winPct: 0.692,
        },
      ],
    },
  ];
}
