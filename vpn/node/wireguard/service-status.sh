#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
SERVICE="wg-quick@${WG_INTERFACE}"

echo "[NexaVPN] WireGuard service status"
echo "================================"

if ! systemctl list-unit-files | grep -q "^${SERVICE}\.service"; then
  echo "[ERROR] Service ${SERVICE} not found."
  exit 1
fi

systemctl is-enabled "${SERVICE}" 2>/dev/null || true

echo

if systemctl is-active --quiet "${SERVICE}"; then
  echo "Service: ACTIVE"
else
  echo "Service: INACTIVE"
fi

echo

systemctl status \
  "${SERVICE}" \
  --no-pager \
  --lines=20
