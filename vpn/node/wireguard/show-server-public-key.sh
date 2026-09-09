#!/usr/bin/env bash

set -euo pipefail

KEY_DIR="${KEY_DIR:-/etc/wireguard}"
PUBLIC_KEY="${KEY_DIR}/server_public.key"

if [[ ! -f "${PUBLIC_KEY}" ]]; then
  echo "[ERROR] Server public key not found."
  exit 1
fi

echo "[NexaVPN] Server public key:"
cat "${PUBLIC_KEY}"
echo
