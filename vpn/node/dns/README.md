# NexaVPN Node DNS

This directory contains DNS configuration for NexaVPN VPN nodes.

## Purpose

The VPN node should provide a DNS resolver reachable only through the
WireGuard interface.

Expected network:

- WireGuard interface: `wg0`
- VPN gateway: `10.0.0.1`
- VPN clients: `10.0.0.0/24`
- DNS server: `10.0.0.1:53`

## Resolver

NexaVPN uses dnsmasq as the node-local DNS forwarding layer.

The resolver forwards external DNS requests to the configured upstream
resolvers while preventing direct DNS access from the public interface.

## Important

Do not expose UDP/TCP port 53 to the public internet.

Firewall rules must allow DNS only from the VPN interface/subnet.

## Production requirements

Before production deployment:

1. Replace placeholder DNS/network values with node-specific configuration.
2. Configure firewall rules.
3. Disable public DNS access.
4. Verify IPv4 DNS routing.
5. Verify IPv6 DNS leak protection.
6. Test DNS after reconnecting networks.
7. Monitor resolver availability.
8. Consider encrypted upstream DNS if required by the privacy policy.
9. Keep DNS logs disabled unless explicitly required for security/operations.

## Validation

From a connected VPN client:

```bash
dig example.com @10.0.0.1
