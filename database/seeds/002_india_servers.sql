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

INSERT INTO vpn_servers (
    name,
    country_code,
    city,
    region,
    enabled
)
SELECT
    'NexaVPN India Bengaluru',
    'IN',
    'Bengaluru',
    'india',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM vpn_servers
    WHERE country_code = 'IN'
      AND city = 'Bengaluru'
);

INSERT INTO vpn_servers (
    name,
    country_code,
    city,
    region,
    enabled
)
SELECT
    'NexaVPN India Hyderabad',
    'IN',
    'Hyderabad',
    'india',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM vpn_servers
    WHERE country_code = 'IN'
      AND city = 'Hyderabad'
);

INSERT INTO vpn_servers (
    name,
    country_code,
    city,
    region,
    enabled
)
SELECT
    'NexaVPN India Chennai',
    'IN',
    'Chennai',
    'india',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM vpn_servers
    WHERE country_code = 'IN'
      AND city = 'Chennai'
);
