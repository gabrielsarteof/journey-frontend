/// <reference types="vite/client" />

// Declaração de módulos para importação de SVG como componentes React
declare module '*.svg?react' {
  import { FunctionComponent, SVGProps } from 'react'
  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module '*.svg' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  // Application
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_NODE_ENV: string

  // API
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string

  // Authentication
  readonly VITE_AUTH_TOKEN_STORAGE_KEY: string
  readonly VITE_AUTH_REFRESH_TOKEN_STORAGE_KEY: string
  readonly VITE_AUTH_SESSION_STORAGE_KEY: string

  // Feature Flags
  readonly VITE_ENABLE_DEV_TOOLS: string
  readonly VITE_ENABLE_ROUTER_DEVTOOLS: string
  readonly VITE_ENABLE_QUERY_DEVTOOLS: string
  readonly VITE_ENABLE_AUTH_PERSISTENCE: string

  // UI
  readonly VITE_DEFAULT_THEME: string
  readonly VITE_ENABLE_DARK_MODE: string
  readonly VITE_ANIMATION_DURATION: string

  // External Services
  readonly VITE_SENTRY_DSN: string
  readonly VITE_ANALYTICS_ID: string

  // Development
  readonly VITE_DEBUG_MODE: string
  readonly VITE_MOCK_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}