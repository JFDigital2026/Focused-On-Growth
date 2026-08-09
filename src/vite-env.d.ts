/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script Web App URL for contact form submissions. */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
