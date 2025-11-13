export const env = {
  // Application
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Journey',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',

  // API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

  // Authentication
  AUTH_TOKEN_STORAGE_KEY: import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY || 'journey_access_token',
  AUTH_REFRESH_TOKEN_STORAGE_KEY: import.meta.env.VITE_AUTH_REFRESH_TOKEN_STORAGE_KEY || 'journey_refresh_token',
  AUTH_SESSION_STORAGE_KEY: import.meta.env.VITE_AUTH_SESSION_STORAGE_KEY || 'journey_auth_session',
  AUTH_USE_SESSION_STORAGE: import.meta.env.VITE_AUTH_USE_SESSION_STORAGE !== 'false',

  // Feature Flags
  ENABLE_DEV_TOOLS: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
  ENABLE_ROUTER_DEVTOOLS: import.meta.env.VITE_ENABLE_ROUTER_DEVTOOLS === 'true',
  ENABLE_QUERY_DEVTOOLS: import.meta.env.VITE_ENABLE_QUERY_DEVTOOLS === 'true',
  ENABLE_AUTH_PERSISTENCE: import.meta.env.VITE_ENABLE_AUTH_PERSISTENCE === 'true',

  // UI
  DEFAULT_THEME: import.meta.env.VITE_DEFAULT_THEME || 'light',
  ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  ANIMATION_DURATION: Number(import.meta.env.VITE_ANIMATION_DURATION) || 300,

  // External Services
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID || '',

  // Development
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true',

  // Utils
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const