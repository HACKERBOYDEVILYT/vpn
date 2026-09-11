-- NexaVPN India server seed migration.
--
-- This migration inserts the initial India region
-- server records if they do not already exist.

INSERT INTO vpn_servers (
    name,
    country_code,
    city,
    region,
    enabled
)
SELECT
    'NexaVPN India Mumbai',
    'IN',
    'Mumbai',
    'india',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM vpn_servers
    WHERE country_code = 'IN'
      AND city = 'Mumbai'
);

INSERT INTO vpn_servers (
    name,
    country_code,
    city,
    region,
    enabled
)
SELECT
    'NexaVPN India Delhi',
    'IN',
    'Delhi',
    'india',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM vpn_servers
    WHERE country_code = 'IN'
      AND city = 'Delhi'
);
