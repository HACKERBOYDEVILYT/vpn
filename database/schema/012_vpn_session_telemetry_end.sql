ALTER TABLE vpn_session_telemetry
ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS
  idx_vpn_session_telemetry_ended_at
ON vpn_session_telemetry (ended_at);
