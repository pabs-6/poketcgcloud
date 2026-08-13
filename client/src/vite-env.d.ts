/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_TCGPLAYER_PARTNER_LINK?: string;
  readonly VITE_CARDMARKET_REFERRER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
