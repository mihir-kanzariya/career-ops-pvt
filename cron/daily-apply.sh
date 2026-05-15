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
