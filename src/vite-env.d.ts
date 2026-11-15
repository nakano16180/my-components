/// <reference types="vite/client" />

import type * as React from "react"

declare module "mdx/types" {
  export import JSX = React.JSX
}
