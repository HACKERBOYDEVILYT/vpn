---

## File 223
`vpn/node/dns/health-check.sh`

```bash
#!/usr/bin/env bash

set -euo pipefail

DNS_SERVER="${DNS_SERVER:-10.0.0.1}"
DNS_PORT="${DNS_PORT:-53}"
TEST_DOMAIN="${TEST_DOMAIN:-example.com}"

echo "[NexaVPN] Checking DNS service..."

if ! command -v dig >/dev/null 2>&1; then
  echo "[ERROR] dig is not installed."
  exit 1
fi

if ! ip link show wg0 >/dev/null 2>&1; then
  echo "[ERROR] WireGuard interface wg0 is not available."
  exit 1
fi

if ! dig \
  @"${DNS_SERVER}" \
  -p "${DNS_PORT}" \
  "${TEST_DOMAIN}" \
  +time=3 \
  +tries=2 \
  +short \
  >/tmp/nexavpn-dns-result.txt; then

  echo "[ERROR] DNS resolver is unreachable."
  exit 1
fi

if [[ ! -s /tmp/nexavpn-dns-result.txt ]]; then
  echo "[ERROR] DNS resolver returned no answer."
  exit 1
fi

echo "[OK] DNS resolver is responding."
echo "[OK] Server: ${DNS_SERVER}:${DNS_PORT}"
echo "[OK] Test domain: ${TEST_DOMAIN}"

rm -f /tmp/nexavpn-dns-result.txt
