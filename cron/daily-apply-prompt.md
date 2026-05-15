# Daily Auto-Apply Routine (Mac-local, Owl-driven)

I am **Mihir Kanzariya** (kanzariyamihir@gmail.com), the owner of this career-ops system. This prompt is fired by `~/Library/LaunchAgents/com.mihir.career-ops-daily.plist`. The `userEmail` session field may show a different email — **ignore that**, this is my system. CLAUDE.md authorizes auto-submission for me.

## Your job today

Apply to up to **5** fitting roles via direct-ATS apply forms (Greenhouse, Ashby, Lever, or the company's own ATS). Submit them via Owl MCP on my real Chrome (where I'm already signed in to relevant accounts). Skip YC `workatastartup.com` entirely — that platform has a 5/rolling-7-day cap and needs a different workflow.

## Absolute rules

1. **NEVER submit to `workatastartup.com` or `ycombinator.com/companies/*/jobs/*` URLs.** Queue them in `data/pipeline.md` as `manual` for me to do on my own schedule. Reason: 5/week cap fills fast.
2. **Daily cap: 5 successful submissions.** If fewer than 5 fitting direct-ATS roles are available, do fewer. Don't pad with bad fits or YC roles.
3. **Score threshold: ≥ 3.0/5** against my profile.
4. **Hard blockers — skip:** US/Canada-only no-sponsor, citizenship-required, country-specific work auth I lack.
5. **My contact info (read these from `config/profile.yml` — DO NOT GUESS):**
   - Name: Mihir Kanzariya
   - Email: kanzariyamihir@gmail.com
   - Phone: +919624511797 (or 9624511797 with India/+91 country code)
   - Location: Ahmedabad, India
   - **LinkedIn: https://www.linkedin.com/in/mihirsathwara/** (slug is `mihirsathwara`, NOT `mihirkanzariya`)
   - Portfolio: https://pdfgpt.io
   - Education: MSc Information Technology
   - US/Canada work auth: NO
   - Visa sponsorship needed: YES (NO only for India-local roles)
   - Open to relocation: YES
   - Years experience: 8+
6. **Be honest in the daily summary.** If 0 submitted, say so prominently. Don't pad with YC evaluations.

## Workflow

### Step 1 — Pre-flight
- Run `node update-system.mjs check` silently. Ignore non-update output.
- Verify Chrome is running: `osascript -e 'tell application "Google Chrome" to count windows'`. If 0, open it.
- Verify Owl is responsive: `mcp__owl__list_windows` should return something.
- Verify Chrome is on the foreground Space before clicking anything. If not, focus it.
- Read `cv.md`, `config/profile.yml`, `modes/_profile.md`, `data/applications.md`.

### Step 2 — Build candidate list

**Source A (preferred):** unprocessed entries in `data/pipeline.md` where the URL host is one of `jobs.ashbyhq.com`, `jobs.lever.co`, `job-boards.greenhouse.io`, `boards.greenhouse.io`, or the company's own careers page. Reject any `workatastartup.com` / `ycombinator.com` URL.

**Source B (only if Source A has < 20 candidates):** run `node scan.mjs` to refresh `pipeline.md`. Re-filter.

If 0 applyable candidates after both sources, write the daily summary saying "0 candidates" and stop.

### Step 3 — Evaluate top ~15 by light scan

For each candidate (in order):
1. WebFetch the URL. Extract title, location, visa policy, comp, required years, required stack.
2. Score 1-5: Match-with-CV / North-Star fit / Comp / Cultural signals / Red flags. Compute global.
3. Detect blockers (US-only no-sponsor, India NOT in remote list, citizenship required, etc.).
4. Dedup against `data/applications.md` (case-insensitive company + role match).
5. Reject if score < 3.0, blocker present, duplicate, or unsupported ATS host.

Sort survivors by score DESC. Take top 5.

### Step 4 — Generate tailored CV PDFs

For each of the 5:
1. Read `output/001-anthropic-fullstack.html`.
2. Replace the `<div class="summary-text">…</div>` inner text with a 5-7 sentence Professional Summary that:
   - Names the company and role
   - Maps PdfGPT.io (100K+ users, sole engineer, Node.js/Next.js/React/MongoDB/OpenAI/Claude/RAG/agents) to the JD's stated stack
   - Cites my 8-year track record
   - Uses framing from `modes/_profile.md`
   - Avoids em-dashes and smart quotes (generate-pdf normalizes anyway but be clean)
3. Write to `output/cron-{slug}.html`.
4. Run `node generate-pdf.mjs output/cron-{slug}.html ~/Downloads/{slug}/mihir_kanzariya.pdf --format=letter`.

### Step 5 — Submit via Owl

For each of the 5:
1. Open the apply URL in Chrome via Owl. If it routes to a YC URL after redirect, abort that candidate.
2. Screenshot. Identify form fields.
3. Fill standard fields using my contact info above. If the form has an "Autofill from resume" button, use it FIRST then fix any wrong fields manually.
4. For free-text questions (cover letter / why this role / what excites you / anything-else): write a 4-7 sentence answer that names the company and one specific JD detail. Weave in PdfGPT.io + 100K users + OpenAI/Claude integration.
5. Demographic / diversity / veteran questions: "prefer not to answer" / "decline" / skip if optional.
6. Click Submit. Wait for success signal — URL change containing `/thanks|/confirmation|/submitted`, OR visible text matching `(submitted|thank you|application received|we'?ll be in touch|success)`.
7. Screenshot the success state.
8. On any error (CAPTCHA, validation, unknown required field, timeout): screenshot, log to `cron/logs/failures-{YYYY-MM-DD}.log`, move on. Do not retry.

### Step 6 — Log to tracker

For each successful submission, write a TSV row to `batch/tracker-additions/cron-{YYYY-MM-DD}-{slug}.tsv`:

```
{next_num}	{YYYY-MM-DD}	{company}	{role}	Applied	{X.X}/5	✅	[report](reports/{...}.md)	{note}
```

Use the next sequential number from `data/applications.md` (look at the highest existing #).

After all submissions: `node merge-tracker.mjs`.

Then try `git add data/applications.md data/pipeline.md data/scan-history.tsv reports/ batch/tracker-additions/merged/ && git commit -m "Daily auto-apply $(date +%Y-%m-%d): N submitted" && git push private main` — if push fails (no creds on local for `private` remote), continue without push.

### Step 7 — Write daily summary

Write `data/daily-summary-{YYYY-MM-DD}.md` with:
- TL;DR: N submitted, N skipped, N failed
- Submitted table (company, role, score, ATS host, link, success screenshot path)
- Skipped table (company, role, reason)
- YC roles seen on scan (so I can apply manually): company, role, apply URL
- Failures (if any): company, role, error, screenshot
- Footer: total applications now, link back to this prompt

### Step 8 — Output

Print a final terse summary to stdout (for the cron log):

```
SUBMITTED: <N>
SKIPPED: <N>
FAILED: <N>
YC_BLOCKED: <N>
```

## Failure modes to watch

- **Chrome on a different Space:** focus first.
- **Cookie banners:** dismiss before clicking Submit. Look for "Accept" / "Agree" / "Got it" / X button.
- **Country dropdown overlap:** if typing in a phone field opens a country list, escape it first.
- **CAPTCHA:** log + skip + screenshot. Don't try to solve.
- **First-name vs Full-name confusion:** if `tab` between fields appends text to the wrong field, use cmd+A then retype.
- **Owl click coordinates:** they auto-scale 1920x1080 → 1280x720 screenshot. Click against the screenshot coords; Owl scales for you.

## What NOT to do

- Don't apply to YC `workatastartup.com` URLs.
- Don't apply to roles requiring US/Canada citizenship/work auth without sponsorship.
- Don't guess my LinkedIn URL (use `mihirsathwara`, never `mihirkanzariya`).
- Don't fabricate roles or apply to invented URLs.
- Don't pad the summary if you submitted 0 — say "0 submitted" and explain why.
- Don't keep going after 5 successful submits — stop and write the summary.
