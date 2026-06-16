# Daily Auto-Apply Summary — 2026-06-16

## TL;DR

**0 submitted, 0 skipped, 0 failed — run ABORTED at pre-flight.**

The Owl Accessibility deadlock blocked the run for the **10th consecutive time** (5/15 → 6/16, a full month). This is not a sourcing problem — `data/pipeline.md` has 2,838 direct-ATS URLs ready to go. The blocker is purely on the **submission** path: macOS will not deliver accessibility events to Chrome while the `universalAccessAuthWarn` prompt is open, and Chrome is parked on a fullscreen Mission Control Space that Owl cannot surface.

## What happened (pre-flight)

| Check | Result |
|-------|--------|
| `update-system.mjs check` | dismissed (no update) |
| Chrome running | yes, 2 windows |
| `osascript count windows` | `2` (no -1712 timeout — partial block) |
| `mcp__owl__list_windows` | 14 windows incl. **`universalAccessAuthWarn`** |
| `mcp__owl__screenshot` | succeeded, but **only desktop wallpaper** (Chrome frontmost in menu bar, no window content) |
| `mcp__owl__focus_window "Google Chrome"` | reported success; re-screenshot **byte-identical** — Chrome never surfaced |

Same partial-block signature as 2026-06-09 and 2026-06-15: Owl's control + screen-capture APIs work, but AX *event delivery* is dead while the prompt is open.

## Submitted

_None._

## Skipped

_None evaluated — aborted before candidate evaluation to avoid burning tokens on un-submittable work. No PDFs generated._

## YC roles seen on scan (apply manually)

_No scan run this session (aborted at pre-flight)._ Direct-ATS candidates remain queued in `data/pipeline.md`.

## Failures

| Component | Error |
|-----------|-------|
| Owl → Chrome submission | `universalAccessAuthWarn` prompt open + Chrome on fullscreen Space → AX events undeliverable. Log: `cron/logs/failures-2026-06-16.log` |

## Recovery (manual — must be done by Mihir)

1. Surface Chrome off the fullscreen Space (Mission Control / `ctrl+cmd+f`).
2. System Settings → Privacy & Security → Accessibility → re-enable the Owl binary at
   `~/.nvm/versions/node/v24.13.1/lib/node_modules/openowl/.owl/owl-darwin-arm64`.
3. Dismiss the `universalAccessAuthWarn` dialog.
4. Re-run: `launchctl kickstart -k gui/$(id -u)/com.mihir.career-ops-daily`

## Status

- Total applications in tracker: 52 (unchanged).
- **Cron is now 0-for-10 over a full month.** The launchd cron is effectively non-functional until prevention lands — every run just rediscovers the same deadlock and burns tokens. Strongly recommend the wrapper pre-flight (detect `universalAccessAuthWarn` and exit early with a push, before invoking Claude) or moving submission to Playwright. See `memory/owl-accessibility-block.md` §Prevention candidates.
- Fired by `~/Library/LaunchAgents/com.mihir.career-ops-daily.plist`.
