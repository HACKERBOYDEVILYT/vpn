CREATE TABLE IF NOT EXISTS favorite_servers (
    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    server_id UUID NOT NULL
        REFERENCES vpn_servers(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    PRIMARY KEY (
        user_id,
        server_id
    )
);

CREATE INDEX IF NOT EXISTS
idx_favorite_servers_user_id
ON favorite_servers (
    user_id
);

CREATE INDEX IF NOT EXISTS
idx_favorite_servers_server_id
ON favorite_servers (
    server_id
);

CREATE INDEX IF NOT EXISTS
idx_favorite_servers_created_at
ON favorite_servers (
    created_at DESC
);
