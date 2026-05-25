# Daily Auto-Apply Summary — 2026-05-25

> **Note:** The 9:00 AM launchd cron aborted on the known Owl Accessibility deadlock (`universalAccessAuthWarn` + Chrome on a fullscreen Space — see `memory/owl-accessibility-block.md`). This summary is from a **later recovery run** (Chrome reachable, signed in) that completed successfully. The morning failure is logged in `cron/logs/failures-2026-05-25.log`.

## TL;DR

**5 submitted · 5 skipped (notable) · 0 failed · 0 YC-blocked applied**

Hit the daily cap of 5. All submissions were honest direct-ATS applications (Greenhouse + Ashby). No `workatastartup.com` / YC submissions (per policy). All 5 are fresh companies (no duplicates with prior tracker).

## Submitted (5)

| Tracker # | Company | Role | Location | Score | ATS | Confirmation | Success screenshot |
|---|---------|------|----------|-------|-----|--------------|--------------------|
| 43 | GitLab | Senior AI Engineer | Remote, Bangalore (India) | 4.3/5 | Greenhouse | "Thank you for applying to GitLab!" | owl_1779719098258_169.png |
| 46 | Turing | Senior Gen AI Engineer | Remote/Hybrid | 4.2/5 | Greenhouse | "Thank you for applying." | owl_1779719865273_270.png |
| 42 | Deepgram | Software Engineer, Voice Agents / AI | Remote (US-centric) | 3.9/5 | Ashby | green "successfully submitted" banner | owl_1779720826325_395.png |
| 45 | Postman | SW Engineer (Fullstack, frontend-heavy), Product Trust | Bengaluru (India) | 3.6/5 | Greenhouse | "Thank you for applying." | owl_1779721829206_505.png |
| 44 | Postman | Senior Fullstack SWE (Customer Journey) | San Francisco, US | 3.4/5 | Greenhouse | "Thank you for applying." | owl_1779722931550_623.png |

(Reports are `reports/040`–`044`; tracker # assigned by `merge-tracker.mjs`.)

**Highlights:** GitLab (India + all-remote + AI) and Turing (agents/RAG, India-friendly remote, $200-250K) are the strongest, visa-clean fits. Postman Product Trust is India-local (no visa). Deepgram is the voice-AI sweet spot. Postman Customer Journey (SF) is the lowest-priority/highest-location-risk of the five but a genuine growth-engineering fit.

## Work-authorization answers (honest)

- **India roles (GitLab Bangalore, Postman Bengaluru):** sponsorship to remain in current location = **No** (work from India).
- **Turing (remote):** authorized to work in India by nationality; sponsorship to work from country of residence = **No**.
- **Deepgram / Postman-SF (US):** located in US = **No**, require US visa sponsorship = **Yes**, willing to relocate / work onsite = **Yes** (profile: open to relocation).

## Skipped (notable)

| Company | Role | Reason |
|---------|------|--------|
| Razorpay | Lead AI Engineer / Lead SWE / Full Stack Builder (4 listings) | **Expired** (liveness check → redirect-to-error) |
| Lovable | Software Engineer, Product | On-site Stockholm, no sponsorship mention → non-India on-site blocker |
| Zapier | Sr. Applied AI Engineer | Remote but NAMER/EMEA-only; India not eligible |
| GitLab | Senior AI Engineer (EMEA) | Redundant with the Bangalore twin |
| Turing | Senior AI Solutions Engineer (SF) | US-preference pre-sales; weaker IC-builder fit |
| n8n | Sr AI Engineer (Remote Europe) | Pipeline job ID stale/closed (no match in Ashby API) |

Plus dozens of pipeline entries deprioritized as US-only or off-archetype.

## YC roles seen (for manual apply)

None surfaced. Worked exclusively from existing direct-ATS entries in `data/pipeline.md`; did **not** scan or open any `workatastartup.com` / `ycombinator.com` URLs (per policy). Run a YC-specific scan separately if you want YC candidates queued.

## Failures / friction (0 hard failures)

- **Deepgram (Ashby):** repeated macOS "Page Unresponsive" dialogs (Grammarly extension re-scanning the SPA). Clicked "Wait" each time; form preserved state and submitted successfully. The **optional** "What excites you about Deepgram?" free-text garbled on entry (extension intercept) and was left blank — all required fields completed.
- **Greenhouse email verification:** GitLab, Turing, Postman-ProductTrust required an 8-char code (from `no-reply@us.greenhouse-mail.io`, subject "Security code for your application to {Company}"). Retrieved each via Gmail and entered char-by-char. Postman-CustomerJourney skipped the code (email already verified earlier this session).
- **Recurring Owl quirks (handled):** (1) typing long URLs/free-text sometimes triggered the macOS Character Viewer / accent menu — fixed by clearing and retyping, or typing codes char-by-char via `send_keys`. (2) On Greenhouse, the first click after selecting Country occasionally focused First Name, so the phone digits landed there — fixed by clearing First Name and re-clicking Phone. (3) Email field needed a direct click on the input (or Tab from Last Name) to focus.

## Stats

- **Total applications now:** 44 entries in `data/applications.md` (39 prior + 5 today).
- `verify-pipeline.mjs` flags 12 **pre-existing** "Report not found" errors on old entries (#12–39) — unrelated to today; today's 5 reports all exist.

## Footer

- This routine: `~/Library/LaunchAgents/com.mihir.career-ops-daily.plist`
- Morning-failure memory: `memory/owl-accessibility-block.md`
