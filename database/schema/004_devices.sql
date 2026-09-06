CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    platform VARCHAR(20) NOT NULL
        CHECK (
            platform IN (
                'android',
                'ios',
                'windows',
                'macos',
                'linux',
                'web'
            )
        ),

    app_version VARCHAR(50),

    last_seen_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devices_user_id
    ON devices (user_id);

CREATE INDEX IF NOT EXISTS idx_devices_last_seen_at
    ON devices (last_seen_at);
