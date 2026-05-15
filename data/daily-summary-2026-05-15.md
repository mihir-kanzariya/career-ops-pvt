# Daily Auto-Apply Summary -- 2026-05-15

## TL;DR

- **Submitted: 3** (Anthropic Senior FS Engineer Education, Hume AI Senior Platform Engineer, Anthropic Full-Stack SWE Reinforcement Learning)
- **Failed: 2** (Vapi MTS Backend, Vapi Agent Engineer -- both blocked by Ashby file upload)
- **Skipped: 0**
- **YC-blocked: 0** (no YC URLs attempted today)

3 of 5 target applications landed. Both failures hit the same Ashby file-upload roadblock that needs a fix before the next run.

## Submitted

| # | Company | Role | Score | ATS | URL | Screenshot |
|---|---------|------|-------|-----|-----|------------|
| 37 | Anthropic | Senior Full Stack Engineer, Education | 4.0/5 | Greenhouse | https://job-boards.greenhouse.io/anthropic/jobs/5098565008 | `logs/success-2026-05-15-anthropic-edu.png` |
| 38 | Hume AI | Senior Platform Engineer | 3.5/5 | Greenhouse | https://job-boards.greenhouse.io/humeai/jobs/5064248008 | (URL changed to /confirmation; no separate screenshot) |
| 39 | Anthropic | Full-Stack Software Engineer, Reinforcement Learning | 3.8/5 | Greenhouse | https://job-boards.greenhouse.io/anthropic/jobs/5186067008 | `logs/success-2026-05-15-anthropic-fs-rl.png` |

**Notes on Anthropic submissions:** Anthropic's Greenhouse application now requires an 8-character email verification code sent to `kanzariyamihir@gmail.com` on first submit. The first submission (Senior FS Edu) triggered the code; the second Anthropic submission in the same session went straight to `/confirmation` without re-prompting. Gmail MCP tools were used today to retrieve and submit the code (`JYlRYl1b`). For future cron runs, expect the security-code step on the first Anthropic application of the day.

## Failed

| Company | Role | URL | Reason |
|---------|------|-----|--------|
| Vapi | Member of Technical Staff, Backend | https://jobs.ashbyhq.com/vapi/d270d613-30b8-4fdc-96e0-514993ca7a82/application | Ashby `Upload File` button did not open the native file dialog via Owl click or AppleScript `click at` despite multiple coordinate attempts. Text fields all filled (Name, Email, Phone, LinkedIn, GitHub=pdfgpt.io). Screenshot: `logs/failure-2026-05-15-vapi-mts.png` |
| Vapi | Agent Engineer | https://jobs.ashbyhq.com/vapi/a69077ea-c968-42ae-bb74-bd782c790211/application | Same Ashby file-upload blocker. Text fields filled. Screenshot: `logs/failure-2026-05-15-vapi-agent.png` |

**Root cause hypothesis:** Ashby's file-upload button calls `inputEl.click()` from inside a React component, requiring a trusted user gesture. `System Events click at {x, y}` reached the right pixels (Greenhouse's `Attach` button worked the same way for Anthropic and Hume), so the click is landing but Ashby may be filtering synthetic events differently than Greenhouse.

**Fix path for the next run:** either (a) implement drag-and-drop upload via AppleScript Finder drag onto Ashby's drop zone, or (b) move the cron pipeline from Owl/System Events to a Playwright-based flow that can use `setInputFiles` directly on the hidden `_systemfield_resume` input.

## Pre-flight notes

- Update check: `dismissed` (no action)
- Chrome: 1 window initially, expanded to 15 during session (profile picker `Who's using Chrome?` appeared during Vapi navigation; closed via AppleScript `click button 1`)
- Owl MCP: responsive (`list_windows` worked) but every `click` call returned `Click timed out` -- in practice the click DID dispatch on most calls, but the reply was unreliable. `screencapture -x` + `osascript ... tell System Events to click at` was used as a reliable substitute.

## Output

```
SUBMITTED: 3
SKIPPED: 0
FAILED: 2
YC_BLOCKED: 0
```

## Footer

Total applications in tracker now: 39 (was 36 yesterday). Cron prompt at `~/Library/LaunchAgents/com.mihir.career-ops-daily.plist`.
