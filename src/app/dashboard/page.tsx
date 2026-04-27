import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { HighlightedBarChart } from "@/components/ui/highlighted-bar-chart"
import { WidgetsContent } from "@/app/widgets/page"
import FlowPage from "@/app/flow/page"
import { GooeyToastPage } from "@/app/gooey-toast/page"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  const [activeView, setActiveView] = useState<"dashboard" | "chart" | "widgets" | "flow" | "gooey-toast">("dashboard")

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} onViewChange={setActiveView} />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  {activeView === "dashboard" ? "Building Your Application" : activeView === "chart" ? "Demos" : activeView === "flow" ? "Demos" : activeView === "gooey-toast" ? "Playground" : "Wigggle UI"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {activeView === "dashboard" ? "Data Fetching" : activeView === "chart" ? "Chart Demo" : activeView === "flow" ? "React Flow" : activeView === "gooey-toast" ? "Gooey Toast" : "Widgets"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {activeView === "dashboard" ? (
          <div className="flex flex-1 flex-col gap-4 p-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted/50 aspect-video h-12 w-full rounded-lg"
              />
            ))}
          </div>
        ) : activeView === "chart" ? (
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
        ) : activeView === "flow" ? (
          <FlowPage />
        ) : activeView === "gooey-toast" ? (
          <div className="flex-1 overflow-auto">
            <GooeyToastPage />
          </div>
        ) : (
          <div className="bg-muted/20 flex-1">
            <WidgetsContent />
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
