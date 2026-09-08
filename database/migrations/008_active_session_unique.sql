CREATE UNIQUE INDEX IF NOT EXISTS
  idx_vpn_sessions_one_active_per_device
ON vpn_sessions (
  user_id,
  device_id
)
WHERE state IN (
  'connecting',
  'connected',
  'reconnecting'
);
