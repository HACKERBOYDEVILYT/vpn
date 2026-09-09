#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"

echo
echo "================================"
echo "       NexaVPN Node Status"
echo "================================"
echo

if ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "WireGuard: UP"
else
  echo "WireGuard: DOWN"
fi

echo

if command -v wg >/dev/null 2>&1 &&
   ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then

  echo "Interface:"
  wg show "${WG_INTERFACE}" interface

  echo
  echo "Listen Port:"
  wg show "${WG_INTERFACE}" listen-port

  echo
  echo "Public Key:"
  wg show "${WG_INTERFACE}" public-key

  echo
  echo "Peers:"
  wg show "${WG_INTERFACE}" peers | wc -l
fi

echo

echo "IPv4 Forwarding:"
sysctl -n net.ipv4.ip_forward 2>/dev/null || echo "unknown"

echo

echo "IPv6 Disabled:"
sysctl -n net.ipv6.conf.all.disable_ipv6 2>/dev/null || echo "unknown"

echo
echo "================================"
