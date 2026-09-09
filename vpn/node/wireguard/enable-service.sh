#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

SERVICE="wg-quick@${WG_INTERFACE}"

echo "[NexaVPN] Enabling WireGuard service..."

systemctl daemon-reload

systemctl enable "${SERVICE}"

systemctl start "${SERVICE}"

if ! systemctl is-active --quiet "${SERVICE}"; then
  echo "[ERROR] ${SERVICE} is not active."
  systemctl status "${SERVICE}" --no-pager || true
  exit 1
fi

echo "[OK] ${SERVICE} enabled and running."
