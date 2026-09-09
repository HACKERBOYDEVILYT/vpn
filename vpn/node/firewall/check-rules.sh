#!/usr/bin/env bash

set -euo pipefail

echo "[NexaVPN] Checking active firewall rules..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

if ! command -v nft >/dev/null 2>&1; then
  echo "[ERROR] nftables is not installed."
  exit 1
fi

if ! nft list ruleset >/dev/null 2>&1; then
  echo "[ERROR] Unable to read nftables ruleset."
  exit 1
fi

RULESET="$(nft list ruleset)"

if ! grep -q "51820" <<< "${RULESET}"; then
  echo "[WARN] WireGuard port 51820 was not detected."
fi

if grep -Eq \
  'udp dport 53.*accept|tcp dport 53.*accept' \
  <<< "${RULESET}"; then
  echo "[INFO] DNS accept rules detected."
fi

if grep -q "masquerade" <<< "${RULESET}"; then
  echo "[OK] NAT masquerade rule detected."
else
  echo "[WARN] No masquerade rule detected."
fi

echo
echo "[NexaVPN] Firewall inspection complete."
