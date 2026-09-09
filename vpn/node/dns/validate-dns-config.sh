#!/usr/bin/env bash

set -euo pipefail

CONFIG="${DNS_CONFIG:-/etc/dnsmasq.d/nexavpn.conf}"

echo "[NexaVPN] Validating DNS configuration..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

if ! command -v dnsmasq >/dev/null 2>&1; then
  echo "[ERROR] dnsmasq is not installed."
  exit 1
fi

if [[ ! -f "${CONFIG}" ]]; then
  echo "[ERROR] DNS configuration not found:"
  echo "${CONFIG}"
  exit 1
fi

if ! dnsmasq --test --conf-file="${CONFIG}"; then
  echo "[ERROR] dnsmasq configuration validation failed."
  exit 1
fi

if ! grep -q '^listen-address=10\.0\.0\.1$' "${CONFIG}"; then
  echo "[ERROR] DNS is not restricted to the VPN gateway."
  exit 1
fi

if ! grep -q '^no-resolv$' "${CONFIG}"; then
  echo "[ERROR] no-resolv is not enabled."
  exit 1
fi

if ! grep -q '^interface=wg0$' "${CONFIG}"; then
  echo "[ERROR] DNS is not bound to wg0."
  exit 1
fi

echo "[OK] DNS configuration is valid."
