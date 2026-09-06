CREATE TABLE IF NOT EXISTS server_health (
    server_id UUID PRIMARY KEY
        REFERENCES vpn_servers(id)
        ON DELETE CASCADE,

    latency_ms INTEGER NOT NULL,

    packet_loss_percent NUMERIC(5,2),

    load_percent NUMERIC(5,2) NOT NULL DEFAULT 0,

    status VARCHAR(20) NOT NULL DEFAULT 'online'
        CHECK (
            status IN (
                'online',
                'offline',
                'maintenance',
                'degraded'
            )
        ),

    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_server_health_checked_at
    ON server_health (checked_at);

CREATE INDEX IF NOT EXISTS idx_server_health_status
    ON server_health (status);
