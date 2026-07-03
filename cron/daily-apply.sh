#!/bin/zsh
# Daily auto-apply wrapper for ~/Library/LaunchAgents/com.mihir.career-ops-daily.plist
# Fires Mon-Fri at 09:00 IST. Wakes Mac (relies on pmset schedule), ensures Chrome is open,
# caffeinates for up to 45 min, runs Claude Code in non-interactive mode with the prompt
# at cron/daily-apply-prompt.md.
#
# Log: ~/career-ops/cron/logs/run-YYYY-MM-DD.log

set -u

PROJECT_DIR="/Users/mihirkanzariya/career-ops"
PROMPT_FILE="$PROJECT_DIR/cron/daily-apply-prompt.md"
LOG_DIR="$PROJECT_DIR/cron/logs"
DATE="$(date +%Y-%m-%d)"
LOG="$LOG_DIR/run-$DATE.log"
CLAUDE_BIN="/Users/mihirkanzariya/.local/bin/claude"

mkdir -p "$LOG_DIR"

exec >>"$LOG" 2>&1
echo "===================================================================="
echo "Daily apply run starting: $(date -Iseconds)"
echo "===================================================================="

# ---------------------------------------------------------------------------
# PRE-FLIGHT: Owl Accessibility deadlock guard.
#
# Since 2026-05-15 the run repeatedly deadlocks when macOS has the
# `universalAccessAuthWarn` (Accessibility re-grant) dialog open: AX event
# delivery to Chrome is blocked, so Owl can fill forms but Submit never lands,
# and `osascript` to Chrome times out (-1712). Recovery is MANUAL (re-grant
# Accessibility to the Owl binary + surface Chrome off its fullscreen Space),
# so there is no point invoking Claude -- it just burns tokens rediscovering
# the block. Detect it here with a pure-shell check (no AX events) and bail.
# See memory/owl-accessibility-block.md.
# ---------------------------------------------------------------------------
FAIL_LOG="$LOG_DIR/failures-$DATE.log"

notify() {
  # Best-effort desktop notification; independent of Chrome AX.
  osascript -e "display notification \"$1\" with title \"career-ops daily-apply\"" 2>/dev/null || true
}

# Two independent block signals (either is conclusive):
#   A) the universalAccessAuthWarn process is pgrep-visible, OR
#   B) Chrome is running but `osascript count windows` times out (-1712).
# 2026-07-03: signal A alone was too narrow -- the dialog's WINDOW was present
# (visible in Owl `list_windows`) yet the process was NOT pgrep-visible by that
# name, so the guard passed and a full doomed Claude session ran. Signal B (the
# osascript -1712 timeout) is the robust one; check both. The AppleScript is
# wrapped `with timeout of 15 seconds` so a blocked Chrome fails fast instead of
# hanging the default ~120s.
BLOCK_REASON=""
if pgrep -fl "universalAccessAuthWarn" >/dev/null 2>&1; then
  BLOCK_REASON="pgrep 'universalAccessAuthWarn' matched (system Accessibility re-grant dialog open)"
elif pgrep -f "Google Chrome" >/dev/null 2>&1; then
  # Chrome is running -- probe it. A -1712 timeout means AX delivery is deadlocked.
  if ! osascript -e 'with timeout of 15 seconds' -e 'tell application "Google Chrome" to count windows' -e 'end timeout' >/dev/null 2>&1; then
    BLOCK_REASON="osascript 'count windows' of Chrome failed/timed out (-1712) -- AX delivery deadlocked"
  fi
fi

if [ -n "$BLOCK_REASON" ]; then
  echo "PRE-FLIGHT ABORT: Owl AX delivery is blocked ($BLOCK_REASON)."
  echo "Submission is impossible until Accessibility is re-granted manually. Not invoking Claude."
  {
    echo "$DATE daily auto-apply -- ABORTED at wrapper pre-flight (Owl Accessibility deadlock)"
    echo ""
    echo "Detection: $BLOCK_REASON."
    echo "Consequence: AX event delivery to Chrome blocked; Owl Submit cannot land. Claude NOT invoked (0 tokens)."
    echo ""
    echo "Recovery (manual): see memory/owl-accessibility-block.md section Recovery --"
    echo "  1. Surface Chrome off the fullscreen Space (Mission Control / ctrl+cmd+f)."
    echo "  2. System Settings > Privacy & Security > Accessibility > re-enable the Owl binary."
    echo "  3. launchctl kickstart -k gui/\$(id -u)/com.mihir.career-ops-daily"
  } >>"$FAIL_LOG"
  notify "ABORTED: Accessibility dialog open. Re-grant Owl Accessibility, then kickstart the job."
  echo "SUBMITTED: 0"
  echo "SKIPPED: 0"
  echo "FAILED: 0"
  echo "YC_BLOCKED: 0"
  echo "PREFLIGHT: aborted ($BLOCK_REASON)"
  echo "===================================================================="
  echo "Daily apply run finished (pre-flight abort): $(date -Iseconds)"
  echo "===================================================================="
  exit 0
fi

# Make sure Chrome is running so Owl has a target.
if ! pgrep -f "Google Chrome" >/dev/null; then
  echo "Chrome not running, launching..."
  open -a "Google Chrome"
  sleep 5
fi

# Caffeinate this script for up to 45 minutes so the Mac doesn't sleep mid-run.
caffeinate -dimsu -t 2700 &
CAFFEINATE_PID=$!
trap "kill $CAFFEINATE_PID 2>/dev/null" EXIT

# Ensure tools are findable.
export PATH="/Users/mihirkanzariya/.local/bin:/Users/mihirkanzariya/.nvm/versions/node/v24.13.1/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
export HOME="/Users/mihirkanzariya"

cd "$PROJECT_DIR" || exit 1

if [ ! -x "$CLAUDE_BIN" ]; then
  echo "ERROR: claude binary not found or not executable at $CLAUDE_BIN"
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "ERROR: prompt file missing at $PROMPT_FILE"
  exit 1
fi

# Run Claude Code non-interactively, piping the prompt file in.
# --dangerously-skip-permissions: user has explicitly authorized auto-submission in CLAUDE.md.
# -p: print (non-interactive) mode.
"$CLAUDE_BIN" -p --dangerously-skip-permissions <"$PROMPT_FILE"
EXIT=$?

echo "===================================================================="
echo "Daily apply run finished: $(date -Iseconds) (exit=$EXIT)"
echo "===================================================================="
exit $EXIT
