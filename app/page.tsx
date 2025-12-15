"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { GameScoreboard } from "@/components/game-scoreboard"
import { StatsHeader } from "@/components/stats-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { DateNavigator } from "@/components/date-navigator"
import { MainNav } from "@/components/main-nav"
import { formatESPNGames } from "@/lib/utils"
import { Game } from "@/components/types"

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
          `https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateStr}&region=us&lang=es`,
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
