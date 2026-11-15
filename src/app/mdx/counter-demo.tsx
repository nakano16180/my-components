import { useState } from "react"
import { Minus, Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CounterDemo() {
  const [count, setCount] = useState(0)

  return (
    <section aria-label="MDX に埋め込んだカウンター" className="not-prose my-6 overflow-hidden rounded-xl border">
      <div className="bg-muted/40 flex items-center justify-between border-b px-5 py-3 text-xs">
        <span className="font-medium">LIVE PREVIEW</span>
        <span className="text-muted-foreground">React + shadcn/ui</span>
      </div>
      <div className="flex flex-col items-center gap-5 px-6 py-8">
        <p className="text-muted-foreground text-sm">Markdown の中でも、いつもの React。</p>
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" aria-label="1 減らす" onClick={() => setCount((value) => value - 1)}>
            <Minus />
          </Button>
          <output aria-label="カウント" aria-live="polite" className="min-w-16 text-center text-5xl font-semibold tabular-nums">
            {count}
          </output>
          <Button size="icon" aria-label="1 増やす" onClick={() => setCount((value) => value + 1)}>
            <Plus />
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setCount(0)}>
          <RotateCcw />リセット
        </Button>
      </div>
    </section>
  )
}
