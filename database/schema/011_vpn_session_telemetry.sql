CREATE TABLE IF NOT EXISTS vpn_session_telemetry (
  session_id UUID PRIMARY KEY
    REFERENCES vpn_sessions(id)
    ON DELETE CASCADE,

  bytes_in BIGINT NOT NULL DEFAULT 0,
  bytes_out BIGINT NOT NULL DEFAULT 0,

  packets_in BIGINT NOT NULL DEFAULT 0,
  packets_out BIGINT NOT NULL DEFAULT 0,

  connected_at TIMESTAMPTZ,
  last_reported_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT vpn_session_telemetry_bytes_in_non_negative
    CHECK (bytes_in >= 0),

  CONSTRAINT vpn_session_telemetry_bytes_out_non_negative
    CHECK (bytes_out >= 0),

  CONSTRAINT vpn_session_telemetry_packets_in_non_negative
    CHECK (packets_in >= 0),

  CONSTRAINT vpn_session_telemetry_packets_out_non_negative
    CHECK (packets_out >= 0)
);

CREATE INDEX IF NOT EXISTS
  idx_vpn_session_telemetry_last_reported
ON vpn_session_telemetry(last_reported_at);
