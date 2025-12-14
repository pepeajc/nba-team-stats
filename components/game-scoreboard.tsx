import { Card } from "@/components/ui/card";
import { useRouteStorage } from "@/hooks/use-route-storage";
import Link from "next/link";

interface Game {
  gameId: string;
  gameStatus: number;
  gameStatusText: string;
  period: number;
  gameClock: string;
  gameTimeUTC: string;
  shortName: string;
  homeTeam: {
    teamId: string;
    teamName: string;
    teamTricode: string;
    wins: number;
    losses: number;
    score: number;
  };
  awayTeam: {
    teamId: string;
    teamName: string;
    teamTricode: string;
    wins: number;
    losses: number;
    score: number;
  };
}

export function GameScoreboard({ game }: { game: Game }) {
  const { goToGame } = useRouteStorage();

  const isLive = game.gameStatus === 2;
  const isFinal = game.gameStatus === 3;
  const homeWon = game.homeTeam.score > game.awayTeam.score;
  const margin = Math.abs(game.homeTeam.score - game.awayTeam.score);

  const getStatusColor = () => {
    if (isLive) return "text-green-400";
    if (isFinal) return "text-slate-400";
    return "text-slate-500";
  };

  const getStatusBgColor = () => {
    if (isLive) return "bg-green-900/20 border-green-600/50";
    if (isFinal) return "bg-slate-800/50 border-slate-700/50";
    return "bg-slate-800/30 border-slate-700/30";
  };

  const gameTime = new Date(game.gameTimeUTC).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Link
      href={`/games/${game.gameId}`}
      onClick={(e) => {
        e.preventDefault();
        goToGame(game.gameId, game.shortName);
      }}
    >
      <Card
        className={`p-6 border transition-all cursor-pointer hover:border-blue-500/50 hover:bg-slate-800/70 ${getStatusBgColor()}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Away Team */}
          <div className="flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">VISITANTE</p>
                <h3 className="text-lg font-bold text-white">
                  {game.awayTeam.teamName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {game.awayTeam.wins}W - {game.awayTeam.losses}L
                </p>
              </div>
              <div
                className={`text-right ${
                  !homeWon ? "text-yellow-400" : "text-slate-400"
                }`}
              >
                <p className="text-4xl font-bold">{game.awayTeam.score}</p>
              </div>
            </div>
          </div>

          {/* Game Status */}
          <div className="flex flex-col items-center justify-center space-y-3 md:border-l md:border-r md:border-slate-700/30 md:px-6">
            <div className={`text-center ${getStatusColor()}`}>
              {isLive && (
                <>
                  <p className="text-sm font-semibold">En Vivo</p>
                  <p className="text-2xl font-bold">Q{game.period}</p>
                  <p className="text-lg font-mono">{game.gameClock}</p>
                </>
              )}
              {isFinal && (
                <>
                  <p className="text-sm font-semibold">Final</p>
                  <p className="text-xl font-bold text-green-400 mt-2">
                    Diferencia: {margin} pts
                  </p>
                </>
              )}
            </div>
            <div className="text-xs text-slate-500 text-center">{gameTime}</div>
          </div>

          {/* Home Team */}
          <div className="flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`text-right flex-1 ${
                  homeWon ? "text-yellow-400" : "text-slate-400"
                }`}
              >
                <p className="text-4xl font-bold">{game.homeTeam.score}</p>
              </div>
              <div className="text-right flex-1">
                <p className="text-xs text-slate-400 mb-1">LOCAL</p>
                <h3 className="text-lg font-bold text-white text-right">
                  {game.homeTeam.teamName}
                </h3>
                <p className="text-xs text-slate-500 mt-1 text-right">
                  {game.homeTeam.wins}W - {game.homeTeam.losses}L
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
