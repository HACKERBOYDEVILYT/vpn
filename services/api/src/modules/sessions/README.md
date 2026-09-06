# NexaVPN Sessions

The sessions module manages the server-side lifecycle of VPN connections.

## States

- connecting
- connected
- disconnecting
- disconnected
- reconnecting
- error

## Endpoints

### Create session

POST `/sessions`

Creates a new VPN session in the `connecting` state.

### Active sessions

GET `/sessions/active`

Returns the authenticated user's active VPN sessions.

### Session details

GET `/sessions/:sessionId`

Returns a specific VPN session.

### Mark connected

POST `/sessions/:sessionId/connect`

Marks the session as connected.

### Disconnect

POST `/sessions/:sessionId/disconnect`

Marks the session as disconnected and records duration.

## Important

This module tracks VPN session state.

It does not create a real network tunnel.

Real VPN tunneling must be implemented by:

- Android VpnService
- iOS Network Extension / Packet Tunnel
- WireGuard/OpenVPN/IKEv2 infrastructure
- VPN control-plane services
