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
- **Limits:** consumer Gmail accounts can send 100 emails/day through Apps Script. Well beyond expected volume.
- **Failures are honest.** If the endpoint is unreachable or misconfigured, the visitor sees an error with the phone number. The form never shows a false "Message Sent!".
