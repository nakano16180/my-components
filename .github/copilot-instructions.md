# Copilot Instructions

## Commands

```bash
npm run dev       # Start dev server
npm run build     # tsc + vite build (type-check + bundle)
npm run lint      # ESLint
npm run knip      # Dead-code / unused exports detection
npm run preview   # Preview production build
```

No test suite exists yet.

## Architecture

Single-page React 19 + TypeScript + Vite app. There is **no router** — view switching is plain `useState` in `src/app/dashboard/page.tsx`.

```
src/
  app/
    dashboard/page.tsx      # Root page; owns activeView state (see type below)
    widgets/page.tsx        # WidgetsContent (embedded) + WidgetsPage (standalone)
    flow/page.tsx           # React Flow demo using @xyflow/react
    gooey-toast/page.tsx    # Gooey Toast demo using gooey-toast
  components/
    ui/                     # shadcn/ui primitives — do not hand-edit generated files here
    app-sidebar.tsx         # Sidebar; has Pages nav + view-change callbacks
    search-form.tsx
    version-switcher.tsx
  hooks/
    use-mobile.ts
  lib/
    utils.ts                # cn() helper only
  index.css                 # Tailwind v4 config lives here (CSS-first, no tailwind.config.js)
  main.tsx
  App.tsx                   # Thin wrapper that renders <Page />
```

The `activeView` type (kept in sync across `dashboard/page.tsx` and `app-sidebar.tsx`):
```ts
type ActiveView = "dashboard" | "chart" | "widgets" | "flow" | "gooey-toast"
```

### Adding a new view

When adding a view, make coordinated changes across **three files**:

1. **`src/app/<name>/page.tsx`** — create the page component.
2. **`src/app/dashboard/page.tsx`** — add the new key to `ActiveView`, import the page, add a conditional render branch, and update the breadcrumb label maps.
3. **`src/components/app-sidebar.tsx`** — add the new key to `AppSidebarProps["activeView"]` and add a `<SidebarMenuItem>` in the Pages group.

## Key Conventions

### Path aliases
All imports use `@/` for `src/`. Never use relative paths like `../../`.

### Tailwind v4
Config is CSS-first in `src/index.css` — there is no `tailwind.config.js`. Design tokens are CSS custom properties in oklch color space, exposed via `@theme inline`. Dark mode is toggled with the `.dark` class (not `prefers-color-scheme`).

### shadcn/ui (new-york style)
- **CVA variants are split** into separate `*-variants.ts` files (e.g., `button-variants.ts`, `badge-variants.ts`) so they can be imported without pulling in React. Keep this pattern when adding new components.
- Components carry `data-slot` attributes for CSS targeting.
- Add new UI primitives with the shadcn CLI: `npx shadcn@latest add <component>`.
- `cn()` from `@/lib/utils` is used for all className merging.

### Charts
Charts use Recharts via shadcn's `ChartContainer` / `ChartTooltip`. Colors reference CSS variables as `var(--color-<key>)` where `<key>` matches a key in the `ChartConfig` object. See `src/components/ui/highlighted-bar-chart.tsx` for the pattern.

### React Flow (`@xyflow/react`)
The flow page uses `@xyflow/react`. Its stylesheet is already imported at the top of `src/index.css`:
```css
@import "@xyflow/react/dist/style.css";
```
Do not add this import again. Custom node types are defined as plain React components receiving `NodeProps`.

### Gooey Toast (`gooey-toast`)
The gooey-toast package is installed and demoed in `src/app/gooey-toast/page.tsx`. Use `mountToaster` + `toast` from `gooey-toast` for notifications. See that page for usage patterns.

### `"use client"` directive
Interactive pages and complex chart components include `"use client"` (e.g., `flow/page.tsx`, `highlighted-bar-chart.tsx`) even though this is not a Next.js project. It is a no-op here and can be kept or removed. Keep it consistent with existing files in the same category.

### Dead code
Run `npm run knip` before committing to catch unused exports or dependencies.
