import { useEffect, useRef, useState } from "react"
import { mountToaster, toast } from "gooey-toast"
import type { ToasterHandle, ToastPosition } from "gooey-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const positions: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]

const roundnessMap: Record<string, number> = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
}

function fakeAsync(shouldFail = false): Promise<string> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (shouldFail) reject(new Error("Something went wrong!"))
      else resolve("Data loaded successfully")
    }, 2000)
  )
}

export function GooeyToastPage() {
  const [position, setPosition] = useState<ToastPosition>("bottom-right")
  const [roundnessKey, setRoundnessKey] = useState("lg")
  const [timeoutIndicator, setTimeoutIndicator] = useState(true)
  const [fillEnabled, setFillEnabled] = useState(false)
  const toasterRef = useRef<ToasterHandle | null>(null)

  useEffect(() => {
    toasterRef.current?.unmount()
    toasterRef.current = mountToaster({ position })
    return () => {
      toasterRef.current?.unmount()
      toasterRef.current = null
    }
  }, [position])

  const opts = {
    roundness: roundnessMap[roundnessKey],
    timeoutIndicator,
    fill: fillEnabled ? "oklch(0.3 0.05 264)" : undefined,
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <p className="text-muted-foreground text-xs tracking-[0.08em] uppercase">
          Component Playground
        </p>
        <h1 className="text-2xl font-semibold">Gooey Toast</h1>
        <p className="text-muted-foreground text-sm">
          Interactive demo for all{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">gooey-toast</code>{" "}
          methods and options.
        </p>
      </div>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Position */}
          <div className="space-y-2">
            <Label>Position</Label>
            <div className="flex flex-wrap gap-2">
              {positions.map((p) => (
                <button
                  key={p}
                  onClick={() => setPosition(p)}
                  className={cn(
                    "rounded border px-2 py-1 text-xs transition-colors",
                    position === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Roundness */}
          <div className="space-y-2">
            <Label>Roundness</Label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(roundnessMap).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoundnessKey(r)}
                  className={cn(
                    "rounded border px-2 py-1 text-xs transition-colors",
                    roundnessKey === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  )}
                >
                  {r} ({roundnessMap[r]}px)
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={timeoutIndicator}
                onChange={(e) => setTimeoutIndicator(e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              timeoutIndicator
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={fillEnabled}
                onChange={(e) => setFillEnabled(e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              fill (dark bg)
            </label>
          </div>

          {/* Current config badges */}
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">position: {position}</Badge>
            <Badge variant="secondary">roundness: {roundnessKey}</Badge>
            <Badge variant="secondary">
              timeoutIndicator: {timeoutIndicator ? "on" : "off"}
            </Badge>
            <Badge variant="secondary">fill: {fillEnabled ? "on" : "off"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Basic methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Toast Methods</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Button
            variant="outline"
            onClick={() =>
              toast.show({
                title: "Hello!",
                description: "A default toast message.",
                ...opts,
              })
            }
          >
            show
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() =>
              toast.success({
                title: "Success!",
                description: "Operation completed successfully.",
                ...opts,
              })
            }
          >
            success
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() =>
              toast.error({
                title: "Error!",
                description: "Something went wrong.",
                ...opts,
              })
            }
          >
            error
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() =>
              toast.warning({
                title: "Warning!",
                description: "Please proceed with caution.",
                ...opts,
              })
            }
          >
            warning
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() =>
              toast.info({
                title: "Info",
                description: "Here is some useful information.",
                ...opts,
              })
            }
          >
            info
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.action({
                title: "Action required",
                description: "Click the button to confirm.",
                button: {
                  title: "Confirm",
                  onClick: () => toast.success({ title: "Confirmed!" }),
                },
                ...opts,
              })
            }
          >
            action
          </Button>
        </CardContent>
      </Card>

      {/* Promise */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Promise Toast</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(fakeAsync(false), {
                loading: { title: "Fetching data…" },
                success: (msg) => ({ title: "Done!", description: msg, ...opts }),
                error: (err) => ({
                  title: "Failed",
                  description: (err as Error).message,
                  ...opts,
                }),
              })
            }
          >
            promise (success)
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(fakeAsync(true), {
                loading: { title: "Fetching data…" },
                success: (msg) => ({ title: "Done!", description: msg, ...opts }),
                error: (err) => ({
                  title: "Failed",
                  description: (err as Error).message,
                  ...opts,
                }),
              })
            }
          >
            promise (error)
          </Button>
        </CardContent>
      </Card>

      {/* Custom duration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Custom Duration</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3">
          {[1000, 3000, 8000].map((ms) => (
            <Button
              key={ms}
              variant="outline"
              onClick={() =>
                toast.info({ title: `Duration: ${ms}ms`, duration: ms, ...opts })
              }
            >
              {ms / 1000}s
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
