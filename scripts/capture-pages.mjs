import { mkdir } from "node:fs/promises"
import { chromium } from "playwright"

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:4173"
const outDir = process.env.SCREENSHOT_DIR ?? "screenshots"

const views = [
  {
    id: "dashboard",
    button: "Dashboard",
    ready: (page) =>
      page
        .locator('[data-slot="breadcrumb-page"]', { hasText: "Data Fetching" })
        .waitFor(),
  },
  {
    id: "chart",
    button: "Chart Demo",
    ready: async (page) => {
      await page.getByRole("heading", { level: 1, name: "Highlighted Bar Chart" }).waitFor()
      // Recharts draws bars with a short animation. Wait until they have height
      // so the artifact is not an empty chart.
      await page.waitForFunction(() =>
        [...document.querySelectorAll(".recharts-bar-rectangle")].some(
          (el) => el.getBoundingClientRect().height > 40,
        ),
      )
    },
  },
  {
    id: "widgets",
    button: "Wigggle Widgets",
    ready: (page) =>
      page.getByRole("heading", { level: 1, name: "Wigggle Widgets" }).waitFor(),
  },
  {
    id: "flow",
    button: "React Flow",
    ready: async (page) => {
      await page.getByRole("heading", { level: 1, name: "React Flow" }).waitFor()
      await page.locator(".react-flow__node").first().waitFor()
    },
  },
  {
    id: "gooey-toast",
    button: "Gooey Toast",
    ready: (page) =>
      page.getByRole("heading", { level: 1, name: "Gooey Toast" }).waitFor(),
  },
]

async function waitForServer(page) {
  let lastError
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      const response = await page.goto(baseURL, {
        waitUntil: "networkidle",
        timeout: 5_000,
      })
      if (response?.ok()) return
      lastError = new Error(`unexpected status ${response?.status() ?? "none"}`)
    } catch (error) {
      lastError = error
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000))
  }
  throw lastError
}

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await waitForServer(page)
  await page.addStyleTag({
    content:
      "*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }",
  })

  for (const view of views) {
    await page.getByRole("button", { name: view.button, exact: true }).click()
    await view.ready(page)
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({
      path: `${outDir}/${view.id}.png`,
      fullPage: true,
    })
    console.log(`captured ${view.id}`)
  }
} finally {
  await browser.close()
}
