import { useState } from "react"

import Page from "@/app/dashboard/page"

export type ViewMode = "dashboard" | "chart"

function App() {
  const [view, setView] = useState<ViewMode>("dashboard")

  return <Page view={view} onViewChange={setView} />
}

export default App
