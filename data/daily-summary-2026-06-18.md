# Daily Auto-Apply Summary — 2026-06-18

## TL;DR

**0 submitted, 0 skipped (no evaluation reached), 0 failed mid-form.**

Aborted at pre-flight for the **11th consecutive run** due to the documented Owl
Accessibility deadlock. Today was the *hard* variant: `osascript` to Chrome
timed out (`-1712`), not the soft "returns 2" seen on 6/09–6/16.

**This is not a sourcing problem** — `data/pipeline.md` has **2,875** direct-ATS
URLs ready. Submission is mechanically impossible while the macOS Accessibility
re-grant dialog (`universalAccessAuthWarn`) is open, because it blocks AX event
delivery to Chrome. Recovery is **manual**.

**New this run:** I landed the long-overdue prevention — a wrapper pre-flight
guard so future blocked mornings cost ~0 tokens instead of a full doomed run.

## Why 0 submitted (diagnostics)

| Check | Result | Meaning |
|-------|--------|---------|
| `pgrep universalAccessAuthWarn` | MATCH (pid 39962) | Accessibility re-grant dialog is open |
| frontmost app | `UserNotificationCenter` | a system dialog is in front of everything |
| `osascript 'count windows'` (Chrome) | `AppleEvent timed out (-1712)` | full AX block — events can't reach Chrome |
| Chrome process | alive (pid 6893, 17 helpers) | target is fine; only event delivery is dead |

I deliberately did **not** invoke Owl. The `osascript` timeout is conclusive, and
firing Owl would only deadlock the session as it has the prior 10 times.

## Submitted

_None._

## Skipped

_None reached evaluation — aborted at pre-flight before any candidate scan._

## YC roles seen (for manual apply)

_None scanned this run (aborted at pre-flight)._ The pipeline still holds prior
`workatastartup.com` / `ycombinator.com` entries to do manually under the 5/week cap.

## Failures

| Stage | Error | Detail |
|-------|-------|--------|
| Pre-flight | Owl Accessibility deadlock (11th) | `universalAccessAuthWarn` open + Chrome `-1712`; AX delivery blocked. Log: `cron/logs/failures-2026-06-18.log` |

## Prevention landed this run ✅

`cron/daily-apply.sh` now runs a **pre-flight guard** before invoking Claude:

- Pure-shell `pgrep -fl universalAccessAuthWarn` (no AX events, can't itself deadlock).
- On match: writes `cron/logs/failures-{date}.log`, fires a desktop notification,
  prints `SUBMITTED/SKIPPED/FAILED/YC_BLOCKED: 0`, and exits 0.
- Result: a blocked morning now costs ~0 tokens instead of a full doomed Claude session.
- Verified: `zsh -n` passes; the guard fires correctly against today's blocked state.

This implements prevention candidate #1 from `memory/owl-accessibility-block.md`.
The deeper fix (move submission to Playwright headless, removing the Space/AX
dependency entirely) remains the recommended permanent solution.

## Recovery (manual — required to unblock)

1. Surface Chrome off its fullscreen Space (Mission Control / `ctrl+cmd+f`).
2. System Settings → Privacy & Security → Accessibility → re-enable the Owl binary
   (`~/.nvm/versions/node/v24.13.1/lib/node_modules/openowl/.owl/owl-darwin-arm64`).
3. Re-run: `launchctl kickstart -k gui/$(id -u)/com.mihir.career-ops-daily`

## Stats

- Total tracker entries: 50 (highest #52) — **37 Applied**
- Pipeline direct-ATS URLs ready: 2,875
- Cron record: **0-for-11** (5/15, 5/20, 5/21, 5/22, 5/25, 6/2, 6/9, 6/12, 6/15, 6/16, 6/18)

---
_Fired by `~/Library/LaunchAgents/com.mihir.career-ops-daily.plist` → `cron/daily-apply.sh` → `cron/daily-apply-prompt.md`._
