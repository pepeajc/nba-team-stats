import { Card } from "@/components/ui/card";
import { useRouteStorage } from "@/hooks/use-route-storage";
import Link from "next/link";
import { ScoreboardProps } from "./types";

const TeamContent = ({
    teamName,
    score,
    isWiner,
    localLabel,
    logo,
}: {
    teamName: string;
    score: number;
    isWiner: boolean;
    localLabel: string;
    logo: string;
}) => {
    return (
        <div className="flex flex-col items-center">
            <p className="text-xs text-slate-400 mb-1">{localLabel}</p>
            <div className="flex">
                <img
                    src={logo}
                    alt={teamName}
                    className="w-8 h-8 object-contain mr-2"
                />
                <h3 className="text-lg font-bold text-white">{teamName}</h3>
            </div>
            <p
                className={`text-4xl font-bold ${
                    isWiner ? "text-yellow-400" : "text-slate-400"
                }`}
            >
                {score}
            </p>
        </div>
    );
};

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

    return (
        <Link
            href={`/games/${gameId}`}
            onClick={(e) => {
                e.preventDefault();
                goToGame(gameId, shortName);
            }}
        >
            <Card className="p-6 border transition-all cursor-pointer mb-5 bg-slate-700/70
             hover:border-slate-700/70 hover:bg-slate-800/70 grid grid-cols-1 md:grid-cols-3 gap-6">
                <TeamContent
                    teamName={awayTeam.teamName}
                    score={awayTeam.score}
                    isWiner={awayTeam.score > homeTeam.score}
                    localLabel="VISITANTE"
                    logo={awayTeam.logo}
                />
                <time className="flex justify-center items-center">{gameTime}</time>
                <TeamContent
                    teamName={homeTeam.teamName}
                    score={homeTeam.score}
                    isWiner={homeTeam.score > awayTeam.score}
                    localLabel="LOCAL"
                    logo={homeTeam.logo}
                />
            </Card>
        </Link>
    );
}
