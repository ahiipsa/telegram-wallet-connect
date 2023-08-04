/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_WALLET_GRAPHQL_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}