CREATE TABLE IF NOT EXISTS vpn_sessions (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    device_id UUID NOT NULL
        REFERENCES devices(id)
        ON DELETE CASCADE,

    server_id UUID NOT NULL
        REFERENCES vpn_servers(id)
        ON DELETE RESTRICT,

    protocol VARCHAR(20) NOT NULL
        CHECK (
            protocol IN (
                'wireguard',
                'openvpn',
                'ikev2'
            )
        ),

    state VARCHAR(20) NOT NULL
        DEFAULT 'connecting'
        CHECK (
            state IN (
                'connecting',
                'connected',
                'disconnecting',
                'disconnected',
                'reconnecting',
                'error'
            )
        ),

    started_at TIMESTAMPTZ,

    ended_at TIMESTAMPTZ,

    duration_seconds INTEGER,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS
idx_vpn_sessions_user_id
ON vpn_sessions (
    user_id
);

CREATE INDEX IF NOT EXISTS
idx_vpn_sessions_device_id
ON vpn_sessions (
    device_id
);

CREATE INDEX IF NOT EXISTS
idx_vpn_sessions_server_id
ON vpn_sessions (
    server_id
);

CREATE INDEX IF NOT EXISTS
idx_vpn_sessions_state
ON vpn_sessions (
    state
);

CREATE INDEX IF NOT EXISTS
idx_vpn_sessions_created_at
ON vpn_sessions (
    created_at DESC
);
