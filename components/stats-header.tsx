export function StatsHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-white font-bold text-xl">🏀</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">NBA Stats</h1>
              <p className="text-sm text-slate-400">Últimos Partidos</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Datos en vivo</p>
            <p className="text-sm text-green-400 font-semibold">● En línea</p>
          </div>
        </div>
      </div>
    </header>
  )
}
