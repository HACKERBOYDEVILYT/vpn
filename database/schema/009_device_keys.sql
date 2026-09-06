CREATE TABLE IF NOT EXISTS device_keys (
    id UUID PRIMARY KEY,

    device_id UUID NOT NULL
        REFERENCES devices(id)
        ON DELETE CASCADE,

    key_type VARCHAR(30) NOT NULL
        CHECK (
            key_type IN (
                'wireguard'
            )
        ),

    public_key TEXT NOT NULL,

    private_key_encrypted TEXT,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    rotated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS
idx_device_keys_device_type
ON device_keys (
    device_id,
    key_type
);

CREATE INDEX IF NOT EXISTS
idx_device_keys_public_key
ON device_keys (
    public_key
);
