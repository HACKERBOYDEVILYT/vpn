CREATE TABLE IF NOT EXISTS vpn_servers (
    id UUID PRIMARY KEY,

    country VARCHAR(100) NOT NULL,

    country_code CHAR(2) NOT NULL,

    city VARCHAR(100) NOT NULL,

    hostname VARCHAR(255) NOT NULL UNIQUE,

    public_key TEXT NOT NULL,

    protocols TEXT[] NOT NULL DEFAULT ARRAY['wireguard']::TEXT[],

    status VARCHAR(20) NOT NULL DEFAULT 'online'
        CHECK (
            status IN (
                'online',
                'offline',
                'maintenance',
                'degraded'
            )
        ),

    latency_ms INTEGER,

    load_percent NUMERIC(5,2),

    capacity INTEGER,

    region VARCHAR(100) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vpn_servers_country
    ON vpn_servers (country);

CREATE INDEX IF NOT EXISTS idx_vpn_servers_country_code
    ON vpn_servers (country_code);

CREATE INDEX IF NOT EXISTS idx_vpn_servers_city
    ON vpn_servers (city);

CREATE INDEX IF NOT EXISTS idx_vpn_servers_status
    ON vpn_servers (status);

CREATE INDEX IF NOT EXISTS idx_vpn_servers_region
    ON vpn_servers (region);

CREATE INDEX IF NOT EXISTS idx_vpn_servers_protocols
    ON vpn_servers USING GIN (protocols);

DROP TRIGGER IF EXISTS vpn_servers_set_updated_at
ON vpn_servers;

CREATE TRIGGER vpn_servers_set_updated_at
BEFORE UPDATE ON vpn_servers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
