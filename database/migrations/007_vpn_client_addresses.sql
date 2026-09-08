CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS vpn_client_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  device_id UUID NOT NULL
    REFERENCES devices(id)
    ON DELETE CASCADE,

  server_id UUID NOT NULL
    REFERENCES vpn_servers(id)
    ON DELETE CASCADE,

  address INET NOT NULL,

  protocol VARCHAR(20) NOT NULL,

  created_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW(),

  released_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS
  idx_vpn_client_addresses_active
ON vpn_client_addresses(server_id, address)
WHERE released_at IS NULL;

CREATE INDEX IF NOT EXISTS
  idx_vpn_client_addresses_device
ON vpn_client_addresses(device_id)
WHERE released_at IS NULL;
