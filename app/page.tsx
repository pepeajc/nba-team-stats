"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { GameScoreboard } from "@/components/game-scoreboard"
import { StatsHeader } from "@/components/stats-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { DateNavigator } from "@/components/date-navigator"
import { MainNav } from "@/components/main-nav"

interface Game {
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

export default function Home() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday
  })

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
        const day = String(selectedDate.getDate()).padStart(2, "0")
        const dateStr = `${year}${month}${day}`

        console.log(dateStr, "fetching NBA games")

        const response = await fetch(
          `https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateStr}&region=us&lang=en`,
        )

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        

        // Prueba de getByShortName con el shortName proporcionado
        // const matchedEvent = getByShortName("CHI @ CHA", data)
        // console.log("getByShortName('CHI @ CHA') =>", matchedEvent)
        // // Prueba de getSlugName para game y player
        // const gameSlug = getSlugName('game', 'CHI @ CHA')
        // const playerSlug = getSlugName('player', 'Ronald%20Holland%20II')
        // console.log("getSlugName('game','CHI @ CHA') =>", gameSlug)
        // console.log("getSlugName('player','Ronald%20Holland%20II') =>", playerSlug)
        // // Prueba inversa con getShortName
        // const backToGameShort = getShortName('game', gameSlug)
        // const backToPlayerShort = getShortName('player', playerSlug)
        // console.log("getShortName('game', gameSlug) =>", backToGameShort)
        // console.log("getShortName('player', playerSlug) =>", backToPlayerShort)


        const formattedGames = formatESPNGames(data.events || [])
        setGames(formattedGames)
        setError(null)
      } catch (err) {
        console.log("[v0] Error fetching NBA games:", err)
        setError("No se pudieron cargar los partidos. Intenta con otra fecha.")
        setGames([])
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [selectedDate])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <MainNav />
        <StatsHeader />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <MainNav />
      <StatsHeader />

      <div className="container mx-auto px-4 py-8">
        <DateNavigator currentDate={selectedDate} onDateChange={setSelectedDate} />

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200">{error}</div>
        )}

        {games.length === 0 ? (
          <Card className="p-12 text-center bg-slate-800/50 border-slate-700">
            <p className="text-slate-400">No hay partidos disponibles para esta fecha</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {games.map((game) => (
              <GameScoreboard key={game.gameId} game={game} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function formatESPNGames(events: any[]): Game[] {
  return events
    .map((event) => {
      const competition = event.competitions?.[0]
      if (!competition) return null

      const homeTeam = competition.competitors?.find((c: any) => c.homeAway === "home")
      const awayTeam = competition.competitors?.find((c: any) => c.homeAway === "away")

      if (!homeTeam || !awayTeam) return null

      const status = event.status?.type?.name || "scheduled"
      let gameStatus = 1
      let gameStatusText = "Scheduled"

      if (status.includes("live") || status.includes("in_progress")) {
        gameStatus = 2
        gameStatusText = "In Progress"
      } else if (status.includes("final") || status.includes("completed")) {
        gameStatus = 3
        gameStatusText = "Final"
      }

      return {
        gameId: event.id,
        gameETag: `"${event.id}"`,
        gameStatus,
        gameStatusText,
        period: competition.status?.period || 0,
        gameClock: competition.status?.displayClock || "0:00",
        gameTimeUTC: event.date || new Date().toISOString(),
        regulationPeriods: 4,
        seriesGameNumber: "1",
        seriesText: "",
        shortName: event.shortName || "",
        homeTeam: {
          teamId: homeTeam.team?.id,
          teamName: homeTeam.team?.name || "",
          teamTricode: homeTeam.team?.abbreviation || "",
          wins: homeTeam.records?.[0]?.wins || 0,
          losses: homeTeam.records?.[0]?.losses || 0,
          score: Number.parseInt(homeTeam.score || "0"),
        },
        awayTeam: {
          teamId: awayTeam.team?.id,
          teamName: awayTeam.team?.name || "",
          teamTricode: awayTeam.team?.abbreviation || "",
          wins: awayTeam.records?.[0]?.wins || 0,
          losses: awayTeam.records?.[0]?.losses || 0,
          score: Number.parseInt(awayTeam.score || "0"),
        },
      }
    })
    .filter((game): game is Game => game !== null)
}
