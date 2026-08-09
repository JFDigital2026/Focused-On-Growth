/**
 * Google Apps Script Web App URL that receives contact form submissions.
 * It ends in /exec. See README.md ("Contact form") for how to generate it.
 *
 * Paste the URL below. It is not a secret — it is a public endpoint that only
 * accepts form submissions, and it gets baked into the built JavaScript no
 * matter where it is stored, so committing it is fine.
 *
 * Until this is filled in, the form shows an error instead of pretending to
 * send. Set VITE_CONTACT_ENDPOINT in .env.local to override it locally
 * without editing this file.
 */
const FALLBACK_ENDPOINT = "https://script.google.com/macros/s/AKfycbyG0eTan1vmlEhIJSQn0a-PQ2vGhw_mKATW8OD_xqeNWedOUpWjT7IsB5kBgOzp2VOjbA/exec"

export const CONTACT_ENDPOINT: string =
  import.meta.env.VITE_CONTACT_ENDPOINT ?? FALLBACK_ENDPOINT;

/** Phone number shown to the visitor if a submission fails. */
export const CONTACT_PHONE = "215-752-3409";
