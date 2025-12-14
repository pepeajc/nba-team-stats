"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DateNavigatorProps {
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function DateNavigator({ currentDate, onDateChange }: DateNavigatorProps) {
  const formattedDate = currentDate.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    onDateChange(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    onDateChange(newDate)
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  return (
    <div className="mb-6 flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={handlePreviousDay}
          variant="outline"
          size="sm"
          className="bg-slate-700 hover:bg-slate-600 border-slate-600"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center min-w-64">
          <p className="text-xs text-slate-400">Partidos de</p>
          <p className="text-lg font-semibold text-white capitalize">{formattedDate}</p>
        </div>

        <Button
          onClick={handleNextDay}
          variant="outline"
          size="sm"
          className="bg-slate-700 hover:bg-slate-600 border-slate-600"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <Button
        onClick={handleToday}
        variant="outline"
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
      >
        Hoy
      </Button>
    </div>
  )
}
