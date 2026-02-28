#!/usr/bin/env bash
# Converts copy_DA4EDF1E-A35E-446C-8664-319220648E68.MOV to M4A for the preview song.
# Usage: ./scripts/convert-preview-audio.sh [path/to/file.MOV]
# If no path is given, looks for the file in the project root and in Desktop.

set -e
NAME="copy_DA4EDF1E-A35E-446C-8664-319220648E68"
OUT_DIR="public/audio"
OUT="${OUT_DIR}/${NAME}.m4a"

if [[ -n "$1" ]]; then
  SRC="$1"
else
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
  for candidate in \
    "$ROOT/${NAME}.MOV" \
    "$ROOT/${NAME}.mov" \
    "$HOME/Desktop/${NAME}.MOV" \
    "$HOME/Desktop/${NAME}.mov"; do
    if [[ -f "$candidate" ]]; then
      SRC="$candidate"
      break
    fi
  done
fi

if [[ -z "$SRC" || ! -f "$SRC" ]]; then
  echo "Usage: $0 [path/to/copy_DA4EDF1E-A35E-446C-8664-319220648E68.MOV]"
  echo "No MOV file found. Put the file in the project root or pass its path."
  exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
  echo "ffmpeg is required. Install with: brew install ffmpeg"
  exit 1
fi

mkdir -p "$OUT_DIR"
ffmpeg -y -i "$SRC" -vn -acodec copy "$OUT"
echo "Created $OUT — preview song is ready to play."
exit 0
