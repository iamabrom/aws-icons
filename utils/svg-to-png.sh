#!/usr/bin/env bash
# ==================================================
# Author: Abrom Douglas III
# Bluesky: @abrom.dev
# Website: https://abrom.dev
# License: MIT
# Summary: This script can be used to batch convert SVGs to PNGs using Inkscape
# ==================================================

set -euo pipefail

# === CONFIGURATION ===
INKSCAPE_BIN="/Applications/Inkscape.app/Contents/MacOS/inkscape"

# === VALIDATE ARGUMENTS ===
if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <input_directory> <output_directory> <PNG_size>"
  exit 1
fi

INPUT_DIR="$1"
OUTPUT_DIR="$2"
SIZE="$3"

# === GENERATE LOG FILE ===
START_TIME=$(date +"%Y_%m_%d_%H%M%S")
LOG_FILE="$(pwd)/${START_TIME}_convertSvgToPng.log"

# Redirect all stdout (normal output) to the log file
exec 1>>"$LOG_FILE"

# === Function to log to console (stderr) AND log file (stdout) ===
log_status() {
  echo "$@" >&2  # Send to stderr (console)
  echo "$@"      # Send to log file (stdout, already redirected)
}

# === HEADER ===
log_status ""
log_status "🚀 Starting SVG to PNG conversion"
log_status "📅 Start: $START_TIME"
log_status "📂 Input Directory: $INPUT_DIR"
log_status "📁 Output Directory: $OUTPUT_DIR"
log_status "📄 Log File: $LOG_FILE"
log_status ""
echo

# === CHECK INKSCAPE EXISTS ===
if ! [ -x "$INKSCAPE_BIN" ]; then
  log_status "❌ Inkscape binary not found or not executable at: $INKSCAPE_BIN"
  exit 1
fi

INKSCAPE_VERSION=$("$INKSCAPE_BIN" -V)
log_status "✅ Using Inkscape binary: $INKSCAPE_BIN"
log_status "🧪 Inkscape version: $INKSCAPE_VERSION"
log_status "------------------------"
log_status "Processing..."
echo

# === PROCESS SVG FILES ===
find "$INPUT_DIR" -type f -name "*.svg" | while read -r svg_file; do
  rel_path="${svg_file#$INPUT_DIR/}"
  out_rel_path="${rel_path%.svg}.png"
  out_path="$OUTPUT_DIR/$out_rel_path"

  mkdir -p "$(dirname "$out_path")"

  # Log only to file (stdout)
  echo "Converting: $svg_file -> $out_path"
  "$INKSCAPE_BIN" "$svg_file" \
    --export-filename="$out_path" \
    --export-width="$SIZE" \
    --export-background-opacity=0
done

log_status ""
log_status "------------------------"
log_status "✅ All SVG files converted successfully!"
log_status "📄 Full log saved to: $LOG_FILE"
log_status ""
