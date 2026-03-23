import { type ReactNode, useEffect, useMemo, useState } from "react"
import { CalendarDays, CloudSun, Clock3, TrendingUp } from "lucide-react"

type CalendarCell = {
  day: number
  inMonth: boolean
}

function buildCalendarGrid(date: Date): CalendarCell[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const cells: CalendarCell[] = []

  for (let i = firstDay - 1; i >= 0; i -= 1) {
    cells.push({ day: daysInPrev - i, inMonth: false })
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, inMonth: true })
  }
  while (cells.length < 42) {
    cells.push({ day: cells.length - (firstDay + daysInMonth) + 1, inMonth: false })
  }

  return cells
}

function WidgetShell({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <section className="bg-card text-card-foreground border-border rounded-xl border p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </div>
      {children}
    </section>
  )
}

export function WidgetsContent() {
  const [now, setNow] = useState(() => new Date())
  const stocks = useMemo(
    () => [
      { symbol: "NVDA", value: 1213.22, delta: 1.92 },
      { symbol: "AAPL", value: 212.08, delta: -0.46 },
      { symbol: "MSFT", value: 483.34, delta: 0.72 },
    ],
    []
  )

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const monthName = now.toLocaleString("en-US", { month: "long", year: "numeric" })
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const calendar = buildCalendarGrid(now)
  const today = now.getDate()

  return (
    <div className="p-4 md:p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Wigggle Widgets</h1>
        <p className="text-muted-foreground text-sm">
          Copy-and-paste 風のウィジェットをページ追加で確認するサンプル。
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WidgetShell title="Live Clock" icon={<Clock3 className="size-4" />}>
          <div className="animate-[wiggle_3s_ease-in-out_infinite] text-3xl font-semibold tabular-nums">
            {now.toLocaleTimeString("en-US", { hour12: false })}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            {now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </WidgetShell>

        <WidgetShell title="Monthly Calendar" icon={<CalendarDays className="size-4" />}>
          <div className="mb-2 text-xs font-medium">{monthName}</div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {weekDays.map((d) => (
              <div key={d} className="text-muted-foreground py-1">
                {d}
              </div>
            ))}
            {calendar.map((cell, i) => (
              <div
                key={`${cell.day}-${i}`}
                className={[
                  "rounded-md py-1",
                  cell.inMonth ? "text-foreground" : "text-muted-foreground/50",
                  cell.inMonth && cell.day === today ? "bg-primary text-primary-foreground font-medium" : "",
                ].join(" ")}
              >
                {cell.day}
              </div>
            ))}
          </div>
        </WidgetShell>

        <WidgetShell title="Weather Snapshot" icon={<CloudSun className="size-4" />}>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold">24&deg;C</div>
              <div className="text-muted-foreground text-xs">Tokyo, JP</div>
            </div>
            <div className="text-right text-xs">
              <div>Humidity 58%</div>
              <div>Wind 9 km/h</div>
              <div>Rain 12%</div>
            </div>
          </div>
        </WidgetShell>

        <WidgetShell title="Stock Pulse" icon={<TrendingUp className="size-4" />}>
          <ul className="space-y-2">
            {stocks.map((s) => (
              <li key={s.symbol} className="bg-muted/40 flex items-center justify-between rounded-md px-2 py-1.5 text-sm">
                <span className="font-medium">{s.symbol}</span>
                <span className="tabular-nums">{s.value.toFixed(2)}</span>
                <span className={s.delta >= 0 ? "text-emerald-600" : "text-red-600"}>
                  {s.delta >= 0 ? "+" : ""}
                  {s.delta.toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        </WidgetShell>
      </div>
    </div>
  )
}

export default function WidgetsPage() {
  return (
    <main className="bg-muted/20 min-h-screen">
      <WidgetsContent />
    </main>
  )
}
