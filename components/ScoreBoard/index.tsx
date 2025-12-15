import { Card } from "@/components/ui/card";
import { useRouteStorage } from "@/hooks/use-route-storage";
import Link from "next/link";
import { ScoreboardProps } from "./types";

export function Scoreboard({
    homeTeam,
    awayTeam,
    shortName,
    gameTimeUTC,
    gameId,
}: ScoreboardProps) {
    const { goToGame } = useRouteStorage();

    const gameTime = new Date(gameTimeUTC).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    // You may need to define homeWon if used, e.g.:
    const homeWon = homeTeam.score > awayTeam.score;

    return (
        <Link
            href={`/games/${gameId}`}
            onClick={(e) => {
                e.preventDefault();
                goToGame(gameId, shortName);
            }}
        >
            <Card
                className="p-6 border transition-all cursor-pointer hover:border-blue-500/50 hover:bg-slate-800/70"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Away Team */}
                    <div className="flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <p className="text-xs text-slate-400 mb-1">
                                    VISITANTE
                                </p>
                                <h3 className="text-lg font-bold text-white">
                                    {awayTeam.teamName}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    {awayTeam.wins}W - {awayTeam.losses}L
                                </p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold">
                                    {awayTeam.score}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Home Team */}
                    <div className="flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className={`text-right flex-1 ${
                                    homeWon
                                        ? "text-yellow-400"
                                        : "text-slate-400"
                                }`}
                            >
                                <p className="text-4xl font-bold">
                                    {homeTeam.score}
                                </p>
                            </div>
                            <div className="text-right flex-1">
                                <p className="text-xs text-slate-400 mb-1">
                                    LOCAL
                                </p>
                                <h3 className="text-lg font-bold text-white text-right">
                                    {homeTeam.teamName}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 text-right">
                                    {homeTeam.wins}W - {homeTeam.losses}L
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
