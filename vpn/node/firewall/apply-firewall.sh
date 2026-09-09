#!/usr/bin/env bash

set -euo pipefail

NFT_CONFIG="${NFT_CONFIG:-/etc/nftables.d/nexavpn.nft}"

echo "[NexaVPN] Applying firewall configuration..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run this script as root."
  exit 1
fi

if ! command -v nft >/dev/null 2>&1; then
  echo "[ERROR] nftables is not installed."
  exit 1
fi

if [[ ! -f "${NFT_CONFIG}" ]]; then
  echo "[ERROR] Firewall configuration not found:"
  echo "        ${NFT_CONFIG}"
  exit 1
fi

echo "[NexaVPN] Checking nftables syntax..."

nft -c -f "${NFT_CONFIG}"

echo "[NexaVPN] Applying rules..."

nft -f "${NFT_CONFIG}"

echo "[OK] NexaVPN firewall rules applied."
