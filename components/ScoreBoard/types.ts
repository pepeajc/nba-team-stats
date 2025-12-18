interface teamProps {
  teamId: string
  teamName: string
  teamTricode: string
  wins: number
  losses: number
  score: number
  logo: string
}

export interface ScoreboardProps {
  gameId: string
  gameTimeUTC: string
  shortName: string
  homeTeam: teamProps
  awayTeam: teamProps
}