# Daily Auto-Apply Summary — 2026-06-05

## TL;DR
**0 submitted · 0 failed-at-form · 8 evaluated · 0 YC seen in pipeline**

**No applications were submitted today.** The run was blocked by the known macOS
accessibility deadlock *before reaching any application form* — this is not a per-role
failure, it's an environment block affecting the whole session. CV generation and form
filling were deliberately skipped because submission was impossible.

---

## Why 0 submitted — environment block (manual recovery required)

Owl reported 18 windows including **`universalAccessAuthWarn`**. Chrome's single window is
parked on a separate fullscreen Space and would not surface on the captured Space, and macOS
accessibility control is wedged:

| Recovery attempt | Result |
|---|---|
| `focus_window "Google Chrome"` | "Focused" but screenshot shows only desktop wallpaper |
| `cmd+n` (new window on current Space) | nothing appeared on visible Space |
| System Events `AXFullScreen = false` | **AppleEvent timed out (-1712)** |
| Chrome AppleScript `set bounds` | "bounds set" but window still not visible |
| `focus_window "universalAccessAuthWarn"` | **timed out — app unresponsive** |

This matches the documented `owl-accessibility-block.md` deadlock. See
`cron/logs/failures-2026-06-05.log` for the full evidence trail and recovery steps.

**Manual fix:** dismiss the accessibility auth dialog → re-enable Owl helper + Terminal in
System Settings ▸ Privacy & Security ▸ Accessibility → take Chrome out of fullscreen → re-run.

---

## Candidates evaluated (light scan, not submitted)

I light-scanned 10 high-fit, non-Anthropic engineering roles from `pipeline.md` before the
browser block. Findings below. **Ashby-hosted JDs render via JS and could not be read by
WebFetch** — those would have been scored in-browser at apply time (which never happened).

### Skip (hard blocker / poor fit)
| Company | Role | Reason |
|---|---|---|
| RunPod | Software Engineer (Full-Stack) | "unable to sponsor employment visas," US-work-eligible only — **hard blocker** |
| Intercom | Senior Product Engineer, AI Platform | Berlin hybrid 3d/wk, Python/Ruby/Rails stack (weak match); prior Intercom SKIP on work auth |

### Marginal (readable, on-site/US-gated — manual judgment recommended)
| Company | Role | Location / note | Stack fit |
|---|---|---|---|
| Glean | Software Engineer, Fullstack | Mountain View, hybrid 3d/wk. $140–265K. No sponsor statement | React/TS ✅, Go/Java ✗ |
| Glean | Founding Forward Deployed Engineer | SF Bay hybrid 3–4d + 25–50% travel. $160–270K. 4+ yrs, LLM/agents/RAG | Strong AI fit, on-site heavy |
| Vercel | Software Engineer, Backend | "Remote – United States," country-gated, sponsorship Q present. $196–294K | TS/Node/React/SQL ✅ strong |

### Could not score (Ashby JS-rendered — strong AI-agent companies, often remote-friendlier)
These are worth a manual look once the browser is unblocked:
- **Decagon** — Senior Software Engineer, Developer Platform · `https://jobs.ashbyhq.com/decagon/491d67c4-b877-4ddc-895a-496eed6777ed`
- **Sierra** — Software Engineer, Agent Builder · `https://jobs.ashbyhq.com/sierra/2fdb200f-c5cf-420c-9997-5e5cea6e1e20`
- **LangChain** — Senior Backend Software Engineer, LangSmith · `https://jobs.ashbyhq.com/langchain/f07c1416-f126-4925-8606-5dd7c5a90f6f`
- **Bland AI** — Forward Deployed Engineer · `https://jobs.ashbyhq.com/bland/823904dd-f958-45c8-8e9a-4d9755cd03f0`
- **Lindy** — Full Stack SWE (Early Career) — likely under-leveled for 8-yr senior, low priority

(All net-new vs. the tracker — same companies appear but with different roles.)

## YC roles seen on scan
**None.** 0 `workatastartup.com` / `ycombinator.com` URLs in the unprocessed pipeline.

## Failures (at form)
None — the run never reached an application form (blocked at the browser layer).

---
**Total applications logged to date:** 52 (unchanged — nothing submitted today).
**Pipeline:** 2,671 unprocessed direct-ATS candidates remain.
**Routine:** `~/Library/LaunchAgents/com.mihir.career-ops-daily.plist`
