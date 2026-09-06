BEGIN;

CREATE INDEX IF NOT EXISTS
idx_vpn_sessions_active_device
ON vpn_sessions (
    user_id,
    device_id,
    state
);

CREATE INDEX IF NOT EXISTS
idx_vpn_sessions_active_user
ON vpn_sessions (
    user_id,
    state
);

COMMIT;
