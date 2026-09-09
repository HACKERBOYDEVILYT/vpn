#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
WG_CONFIG="${WG_CONFIG:-/etc/wireguard/${WG_INTERFACE}.conf}"

echo "[NexaVPN] Validating WireGuard configuration..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run this script as root."
  exit 1
fi

if ! command -v wg >/dev/null 2>&1; then
  echo "[ERROR] WireGuard tools are not installed."
  exit 1
fi

if [[ ! -f "${WG_CONFIG}" ]]; then
  echo "[ERROR] Configuration not found:"
  echo "        ${WG_CONFIG}"
  exit 1
fi

if grep -Eq \
  'REPLACE_WITH|\\$\\{SERVER_PRIVATE_KEY\\}|\\$\\{CLIENT_PUBLIC_KEY\\}' \
  "${WG_CONFIG}"; then
  echo "[ERROR] Placeholder credentials detected."
  echo "[ERROR] Refusing to validate a production configuration."
  exit 1
fi

if ! grep -q '^\[Interface\]' "${WG_CONFIG}"; then
  echo "[ERROR] Missing [Interface] section."
  exit 1
fi

if ! grep -q '^PrivateKey[[:space:]]*=' "${WG_CONFIG}"; then
  echo "[ERROR] Missing server PrivateKey."
  exit 1
fi

if ! grep -q '^Address[[:space:]]*=' "${WG_CONFIG}"; then
  echo "[ERROR] Missing server Address."
  exit 1
fi

if ! grep -q '^ListenPort[[:space:]]*=' "${WG_CONFIG}"; then
  echo "[ERROR] Missing WireGuard ListenPort."
  exit 1
fi

echo "[OK] Basic WireGuard configuration validation passed."

if command -v wg-quick >/dev/null 2>&1; then
  echo "[INFO] WireGuard tools detected."
fi

echo "[NexaVPN] Validation complete."
