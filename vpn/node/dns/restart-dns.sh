#!/usr/bin/env bash

set -euo pipefail

SERVICE="${DNS_SERVICE:-dnsmasq}"

echo "[NexaVPN] Restarting DNS service..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

if ! systemctl list-unit-files | grep -q "^${SERVICE}\.service"; then
  echo "[ERROR] ${SERVICE} service not found."
  exit 1
fi

systemctl restart "${SERVICE}"

if ! systemctl is-active --quiet "${SERVICE}"; then
  echo "[ERROR] ${SERVICE} failed to start."
  systemctl status "${SERVICE}" --no-pager || true
  exit 1
fi

echo "[OK] ${SERVICE} is running."
