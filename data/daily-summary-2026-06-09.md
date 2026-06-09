# Daily Auto-Apply Summary — 2026-06-09

## TL;DR

**0 submitted, 0 skipped, 0 failed, 0 YC-blocked.**

The run **aborted at pre-flight** — same Owl Accessibility deadlock that has now blocked **7 consecutive runs** (5/15, 5/20, 5/21, 5/22, 5/25, 6/02, 6/09). No candidates were evaluated and no PDFs were generated, because the block hits before Step 2.

## Why it aborted

`mcp__owl__list_windows` showed a `universalAccessAuthWarn` dialog open alongside Chrome. With that prompt open, macOS will not deliver Accessibility (click/keystroke) events to Chrome, and the Chrome window is parked on a fullscreen Mission Control Space that Owl can't surface. So even though Owl's control APIs respond, the form can never be driven.

This time was a *partial* block, not a full hang:

| Check | Result |
|-------|--------|
| `osascript ... count windows` | returned `1` (no `-1712` timeout) |
| `mcp__owl__screenshot` | succeeded (no "Display unresponsive") |
| `mcp__owl__focus_window "Google Chrome"` | succeeded — but only wallpaper rendered |
| click "Window" menu | **no-op** ("Nothing changed on screen") — AX events dead |
| `mcp__owl__configure_uac` | "UAC management is Windows-only" — no macOS recovery path |

So control + screen-capture work, but **AX event delivery is blocked**. Same dead end.

## Submitted

_None._

## Skipped

_None evaluated — aborted before candidate scan._

## YC roles seen

_None scanned._

## Failures

| Stage | Error | Evidence |
|-------|-------|----------|
| Pre-flight (Step 1) | Owl Accessibility deadlock (`universalAccessAuthWarn` + Chrome on fullscreen Space) | `cron/logs/failures-2026-06-09.log` |

## Recovery (manual — please run)

1. **Mission Control** (F3) → drag the Chrome thumbnail onto the active desktop, or enter the fullscreen Chrome Space and exit fullscreen with `ctrl+cmd+f`.
2. **System Settings → Privacy & Security → Accessibility** → re-enable the Owl binary at
   `~/.nvm/versions/node/v24.13.1/lib/node_modules/openowl/.owl/owl-darwin-arm64`
3. Re-run: `launchctl kickstart -k gui/$(id -u)/com.mihir.career-ops-daily`

## Note

The cron is now **0-for-7** with an identical root cause. The prevention candidates in
`owl-accessibility-block.md` (wrapper pre-flight that exits early with a push instead of burning
tokens; pinning Chrome to a non-fullscreen window; or moving submission to a Playwright headless
path) should be treated as load-bearing. Each failed morning still costs tokens to rediscover the
same blocker.

---
Total applications on record: **~50** (highest tracker #: 52).
Fired by `~/Library/LaunchAgents/com.mihir.career-ops-daily.plist`.
