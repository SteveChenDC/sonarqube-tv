#!/usr/bin/env bash
# Visual QA — takes screenshots of key pages for Ralph to analyze.
# Usage: bash scripts/visual-qa.sh [--port 3000]
# Outputs screenshots to ralph-logs/screenshots/

set -euo pipefail

if ! command -v agent-browser &>/dev/null; then
  echo "agent-browser not found. Install: npm install -g agent-browser && agent-browser install"
  exit 1
fi

PORT="${1:-3000}"
BASE="http://localhost:$PORT"
DIR="ralph-logs/screenshots"
mkdir -p "$DIR"

PAGES=("home:/" "home-bottom:/" "watch:/watch/v1" "category:/category/getting-started")
VIEWPORTS=("desktop:1280,800" "mobile:375,812")

for vp_entry in "${VIEWPORTS[@]}"; do
  vp_name="${vp_entry%%:*}"
  dims="${vp_entry#*:}"
  w="${dims%%,*}"
  h="${dims#*,}"

  for page_entry in "${PAGES[@]}"; do
    name="${page_entry%%:*}"
    path="${page_entry#*:}"

    agent-browser open "${BASE}${path}" --viewport "${w}x${h}"
    agent-browser wait network-idle

    # Scroll handling
    if [ "$name" = "home" ]; then
      agent-browser scroll down
      sleep 0.5
    elif [ "$name" = "home-bottom" ]; then
      agent-browser scroll bottom
      sleep 0.5
    fi

    agent-browser screenshot "$DIR/${vp_name}-${name}.png"
    echo "✓ ${vp_name}-${name}.png"
  done
done

agent-browser close
echo ""
echo "Screenshots saved to $DIR/"
