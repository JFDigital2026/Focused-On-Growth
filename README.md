# Focused On Growth Financial Group

Marketing site for Focused On Growth Financial Group. Static single-page app — no backend, no database, no API keys.

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- React Router 7
- Motion (animation), Lucide (icons)

## Run locally

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev
```

Site runs at http://localhost:3000

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000 with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Delete `dist/` |

## Structure

```
index.html
src/
  main.tsx          entry point
  App.tsx           router + shared layout + contact modal state
  index.css         Tailwind theme, base type scale, custom scrollbars
  pages/            Home, Advisors, Services, Careers
  components/       Navbar, Hero, Challenges, Partners, WhyUs,
                    Process, ProcessDiagram, Stages, ContactModal,
                    Button, Footer
```

## Contact form

Submissions are emailed to **admin.focusedongrowth@gmail.com** by a Google Apps Script web app. There is no server to host and nothing to pay for.

How it works: the browser POSTs the form as JSON to a Google Apps Script URL. The script emails the submission and replies with `{"ok":true}`. The site stays fully static.

### One-time setup

Do this while signed in as **admin.focusedongrowth@gmail.com**, so the mail is sent by the account that receives it.

1. Go to https://script.google.com and click **New project**.
2. Delete the placeholder `myFunction` code. Paste in the entire contents of [`apps-script/Code.gs`](apps-script/Code.gs) from this repo.
3. Rename the project (top left) to something like `Focused On Growth Contact Form`. Click the save icon.
4. Click **Deploy → New deployment**.
5. Click the gear next to "Select type" and choose **Web app**.
6. Set:
   - **Description:** anything, e.g. `v1`
   - **Execute as:** `Me (admin.focusedongrowth@gmail.com)`
   - **Who has access:** `Anyone`

   "Anyone" is required — website visitors are not signed into Google. The script only accepts form submissions and returns nothing sensitive.
7. Click **Deploy**. Google asks you to authorize the script's permission to send email as you. Click **Authorize access**, pick the account, then **Advanced → Go to (project name)** on the "Google hasn't verified this app" screen, then **Allow**. That warning is expected for your own private script.
8. Copy the **Web app URL**. It ends in `/exec`.
9. Paste it into `FALLBACK_ENDPOINT` in [`src/config.ts`](src/config.ts).

### Verify it works

Paste the `/exec` URL into a browser tab. It should return:

```json
{"ok":true,"status":"Contact form endpoint is live."}
```

Then run `npm run dev`, submit the form, and check the inbox.

### Notes

- **Changing the script later:** edit the code, then **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. Creating a brand new deployment instead generates a different URL and you would have to update `config.ts`.
- **Where the mail goes** is set by `RECIPIENT` at the top of `Code.gs`, not by the site.
- **Reply-To** is set to the submitter's email, so replying in Gmail goes straight to them.
- **Advisor requests:** the "Request an appointment" button on each advisor's section opens the form with that advisor recorded, shown to the visitor as "Meeting With". The name appears in the email subject and in the "Meeting with" line. Generic Contact buttons leave it blank, which shows as "No preference".
- **Required fields:** first name, last name, phone and email. The message and the SMS consent checkbox are optional.
- **Spam:** the form carries a hidden honeypot field named `company`. Real people never fill it; bots do. The script silently drops anything that has it filled.
- **Failures are honest.** If the endpoint is unreachable or misconfigured, the visitor sees an error with the phone number. The form never shows a false "Message Sent!".

## Bot protection

Layers, outermost first. Everything that matters is enforced in `Code.gs`, because a bot posts straight to the `/exec` URL and never runs the site's JavaScript.

| Layer | What it does |
| --- | --- |
| Cloudflare Turnstile | Rejects anything without a valid, Cloudflare-verified token. The only measure that stops a determined bot. |
| Honeypot | Hidden `company` field. Filled means bot; silently dropped. |
| Time to fill | Submissions completed in under 3 seconds are dropped. |
| Validation | Email format, phone digit count, length caps, body size limit. |
| Duplicate detection | Same person and message within 10 minutes is not re-sent. |
| Burst limit | 10 submissions per minute across the whole site. |
| Per email / per phone | 3 per hour each. |
| Daily cap | 80 emails/day, under Gmail's 100/day ceiling. |
| Spam heuristics | Link flooding, markup, all caps, junk names. Flags rather than discards. |

**Apps Script cannot see the visitor's IP address**, so per-IP limiting is impossible. The rate limits key on email and phone, which a bot can rotate. That is exactly why Turnstile carries the weight; the limits are a backstop that guarantees the Gmail quota survives.

### Turnstile setup

1. In the Cloudflare dashboard go to **Turnstile → Add widget**.
2. Name it, add hostname `focusedongrowth.com` (add `localhost` too if you want it working in local dev).
3. Widget mode: **Managed**. Create.
4. Copy the **Site Key** into `TURNSTILE_SITE_KEY` in [`src/config.ts`](src/config.ts). It is public and belongs in the page.
5. Copy the **Secret Key** into Apps Script: **Project Settings → Script Properties → Add script property**, name `TURNSTILE_SECRET`. Never put the secret in this repo.
6. Redeploy the script (**Manage deployments → pencil → New version**).

Until `TURNSTILE_SECRET` is set the script skips verification, and until the site key is set the widget does not render, so the form keeps working throughout the rollout.

### Testing the form locally

`localhost` is not on the widget's hostname allowlist, so Turnstile answers with error `110200` (invalid domain) during local development and the form refuses to submit. That is correct behaviour, not a bug.

To work on the form locally, create `.env.local` (it is gitignored) with Cloudflare's public test keys:

```
VITE_TURNSTILE_SITE_KEY="1x00000000000000000000AA"
```

That key always passes. Use `2x00000000000000000000AB` to test the blocked path. Alternatively, add `localhost` as a hostname on the widget in the Cloudflare dashboard.

### Submission log

Every accepted submission is appended to a Google Sheet before the email is attempted, so nothing is lost when the daily cap is hit or mail fails. The Sheet is created automatically on the first submission and lives in the Drive of the account that owns the script.

To find it, open the script editor, select `showLogSheetUrl` in the function dropdown, click **Run**, and read the URL from the execution log.

### Tuning

The limits are constants at the top of `Code.gs` (`MAX_EMAILS_PER_DAY`, `MAX_PER_MINUTE`, `MAX_PER_EMAIL_PER_HOUR`, and so on). Change and redeploy to adjust.
