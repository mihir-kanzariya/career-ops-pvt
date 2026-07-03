# Daily Auto-Apply Summary — 2026-07-03

## TL;DR
**0 submitted · 0 skipped-after-scan · 0 failed-mid-apply**

Run aborted at pre-flight. The submission channel (Owl → Chrome) is **deadlocked for the 12th consecutive run** — same `universalAccessAuthWarn` + unreachable-Chrome state as every run since 2026-05-20. No applications could be sent. **This needs a one-time manual fix on the Mac** (steps below); it will not self-heal.

## What happened (pre-flight)
- `update-system.mjs check` → `dismissed` (fine)
- Chrome is **unresponsive to AppleScript** (`AppleEvent timed out -1712`)
- Owl sees 14 windows including a stuck **`universalAccessAuthWarn`** dialog and 3 Chrome windows, but **none render on the foreground Space** — only the desktop wallpaper is visible
- Tried to recover 3 ways — all no-ops:
  1. Focus Chrome → menu bar switches to Chrome but no window appears
  2. Focus the `universalAccessAuthWarn` dialog → can't be surfaced
  3. `Cmd+N` to force a fresh window → Chrome ignores it (hung while the accessibility modal is pending)

## Submitted
_None._

## Skipped (light-scanned for a manual shortlist)
Even a manual shortlist came up thin — the strongest-fit companies (Anthropic, Cohere, LangChain, Decagon) are already applied to, and the best remaining AI full-stack roles are on **Ashby**, whose pages are JS-rendered and can't be light-scanned without the (dead) browser. The Greenhouse roles I could read:

| Company | Role | Fit | Reason not shortlisted |
|---|---|---|---|
| Razorpay | Solutions Engineer | ~2.5 | Kuala Lumpur on-site M–F; pre-sales/integration, not core SWE |
| Vercel | Software Engineer, CDN | ~2.8 | **Go**/CDN/network infra is the core req; Node/Next only "nice-to-have"; SF/NYC hybrid |
| Postman | Backend & System Engineer (Node/Go) | ~3.0 borderline | NYC **on-site 5 days/week** + needs US work auth (sponsorship only "considered") |

## Pipeline is NOT the problem
`data/pipeline.md` holds **3,133 applyable direct-ATS candidates** (0 YC in that set). Plenty of Ashby-hosted AI full-stack roles to apply to once the browser is unblocked: Perplexity (60), Writer (50), Deepgram (41), Attio (20), n8n (22), Supabase (23), Turing (26), etc. Nothing is blocked on candidate supply — only on the browser.

## YC roles seen (apply manually)
None surfaced — no scan was run (channel dead). `pipeline.md` currently contains **0** `workatastartup.com`/`ycombinator.com` URLs.

## Failures
No mid-apply failures — the run never reached an apply form. See `cron/logs/failures-2026-07-03.log`.

## >>> MANUAL RECOVERY NEEDED (one-time, ~2 min) <<<
On the Mac, in a normal interactive session:
1. **Dismiss the stuck dialog:** open Mission Control (F3 / swipe up with 3 fingers), find the **`universalAccessAuthWarn`** window, and close/OK it. If it's about accessibility permission, grant it.
2. **Grant Accessibility to the automation runner:** System Settings → Privacy & Security → **Accessibility**, ensure the Owl/Terminal/automation app is toggled ON. (Same list for **Screen Recording** if screenshots ever go black.)
3. **Un-strand Chrome:** quit Chrome fully (`Cmd+Q`), take it **out of any fullscreen Space** (green-button → don't leave it fullscreen), reopen as a normal window on the main desktop, and stay signed in.
4. Confirm: `osascript -e 'tell application "Google Chrome" to count windows'` returns a number (not a timeout).

Once that's done the next scheduled run should submit normally against the 3,133-candidate queue.

---
Total applications logged: **~50** (tracker unchanged today).
Fired by `~/Library/LaunchAgents/com.mihir.career-ops-daily.plist`.
