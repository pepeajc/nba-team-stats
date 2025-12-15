export interface Game {
  gameId: string
  gameETag: string
  gameStatus: number
  gameStatusText: string
  period: number
  gameClock: string
  gameTimeUTC: string
  regulationPeriods: number
  seriesGameNumber: string
  seriesText: string
  shortName: string
  homeTeam: {
    teamId: string
    teamName: string
    teamTricode: string
    wins: number
    losses: number
    score: number
  }
  awayTeam: {
    teamId: string
    teamName: string
    teamTricode: string
    wins: number
    losses: number
    score: number
  }
}