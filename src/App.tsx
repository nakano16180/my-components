import { useState } from "react"

import Page from "@/app/dashboard/page"
import { HighlightedBarChart } from "@/components/ui/highlighted-bar-chart"
import { Button } from "@/components/ui/button"

type ViewMode = "dashboard" | "chart"

function App() {
  const [view, setView] = useState<ViewMode>("dashboard")

  return (
    <div className="min-h-screen">
      <div className="bg-background/80 sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 p-3">
          <p className="text-sm font-medium">my-components</p>
          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant={view === "dashboard" ? "default" : "outline"}
              onClick={() => setView("dashboard")}
            >
              Dashboard
            </Button>
            <Button
              size="xs"
              variant={view === "chart" ? "default" : "outline"}
              onClick={() => setView("chart")}
            >
              Chart Demo
            </Button>
          </div>
        </div>
      </div>

      {view === "dashboard" ? (
        <Page />
      ) : (
        <main className="mx-auto w-full max-w-[960px] p-4 md:p-8">
          <div className="mb-4">
            <p className="text-muted-foreground text-xs tracking-[0.08em] uppercase">
              Evil Charts Demo
            </p>
            <h1 className="text-2xl font-semibold">Highlighted Bar Chart</h1>
            <p className="text-muted-foreground text-sm">
              Hover a bar to focus one month and inspect values.
            </p>
          </div>
          <HighlightedBarChart />
        </main>
      )}
    </div>
  )
}

export default App
