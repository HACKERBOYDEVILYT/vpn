#!/usr/bin/env bash
set -euo pipefail

RUNTIME_DIR="${RUNTIME_DIR:-/etc/nexavpn}"
BACKUP_DIR="${BACKUP_DIR:-$RUNTIME_DIR/backups}"
CONFIG_FILE="${CONFIG_FILE:-$RUNTIME_DIR/node.env}"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "ERROR: runtime config not found: $CONFIG_FILE"
    exit 1
fi

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup="$BACKUP_DIR/node.env.$timestamp"

cp --preserve=mode,ownership,timestamps "$CONFIG_FILE" "$backup"
chmod 600 "$backup"

echo "Runtime configuration backup created:"
echo "$backup"

echo
echo "NOTE:"
echo "This script creates a protected backup only."
echo "It does not rotate WireGuard keys automatically."
echo "Key rotation must be coordinated with the control-plane and clients."
