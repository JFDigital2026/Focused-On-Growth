/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script Web App URL for contact form submissions. */
  readonly VITE_CONTACT_ENDPOINT?: string;
  /** Cloudflare Turnstile site key (public). */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

/** Cloudflare Turnstile, loaded from challenges.cloudflare.com. */
interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "flexible" | "compact";
    }
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

interface Window {
  turnstile?: TurnstileApi;
  onTurnstileLoad?: () => void;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
