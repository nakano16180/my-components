import type { MDXComponents } from "mdx/types"
import { FileCode2, FileText } from "lucide-react"
import Content from "@/app/mdx/content.mdx"
import { CounterDemo } from "@/app/mdx/counter-demo"
import { Badge } from "@/components/ui/badge"

const components = {
  h1: (props) => <h1 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl" {...props} />,
  h2: (props) => <h2 className="mt-9 mb-4 text-xl font-semibold tracking-tight" {...props} />,
  p: (props) => <p className="text-muted-foreground my-3 text-sm leading-7" {...props} />,
  ul: (props) => <ul className="text-muted-foreground my-4 list-disc space-y-2 pl-5 text-sm leading-6" {...props} />,
  ol: (props) => <ol className="text-muted-foreground my-4 list-decimal space-y-2 pl-5 text-sm leading-6" {...props} />,
  a: (props) => <a className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground" {...props} />,
  pre: (props) => <pre className="bg-muted/50 my-5 overflow-x-auto rounded-lg border p-4 text-xs leading-6" {...props} />,
  code: (props) => <code className="bg-muted rounded px-1 py-0.5 font-mono text-[0.9em]" {...props} />,
  CounterDemo,
} satisfies MDXComponents

export function MdxPage() {
  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline">LIBRARY PLAYGROUND</Badge>
        <span className="text-muted-foreground text-xs">MDX · React · Vite</span>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0">
          <Content components={components} />
        </article>
        <aside aria-label="ファイルの役割" className="bg-muted/20 space-y-5 rounded-xl border p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold">編集するファイル</h2>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 font-mono text-xs"><FileText className="size-4" />content.mdx</p>
            <p className="text-muted-foreground text-xs leading-6">説明文・見出し・デモの配置</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 font-mono text-xs"><FileCode2 className="size-4" />counter-demo.tsx</p>
            <p className="text-muted-foreground text-xs leading-6">見た目・状態・ボタンの操作</p>
          </div>
          <div className="space-y-2 border-t pt-4 text-sm">
            <p className="font-mono text-xs">page.tsx</p>
            <p className="text-muted-foreground text-xs leading-6">レイアウトと MDX への部品登録</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
