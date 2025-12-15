export interface ScoreboardProps {
  gameId: string
  gameTimeUTC: string
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