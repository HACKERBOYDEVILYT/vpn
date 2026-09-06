import type {
  VPNProtocol,
  VPNServer,
  ServerStatus
} from "@nexavpn/types";

import { db } from "../../database/client.js";

interface ServerRow {
  id: string;
  country: string;
  country_code: string;
  city: string;
  hostname: string;
  public_key: string;
  protocols: VPNProtocol[];
  status: ServerStatus;
  latency_ms: number | null;
  load_percent: number | null;
  capacity: number | null;
  region: string;
}

function mapServer(
  row: ServerRow
): VPNServer {
  return {
    id: row.id,
    country: row.country,
    countryCode: row.country_code,
    city: row.city,
    hostname: row.hostname,
    publicKey: row.public_key,
    protocols: row.protocols,
    status: row.status,
    latencyMs:
      row.latency_ms ?? undefined,
    loadPercent:
      row.load_percent ?? undefined,
    capacity:
      row.capacity ?? undefined,
    region: row.region
  };
}

export async function listServers(
  filters: {
    country?: string;
    countryCode?: string;
    city?: string;
    protocol?: VPNProtocol;
    status?: ServerStatus;
    page: number;
    limit: number;
  }
): Promise<{
  servers: VPNServer[];
  page: number;
  limit: number;
  total: number;
}> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (filters.country) {
    values.push(filters.country);
    conditions.push(
      `country ILIKE $${values.length}`
    );
  }

  if (filters.countryCode) {
    values.push(
      filters.countryCode.toUpperCase()
    );

    conditions.push(
      `country_code = $${values.length}`
    );
  }

  if (filters.city) {
    values.push(filters.city);
    conditions.push(
      `city ILIKE $${values.length}`
    );
  }

  if (filters.protocol) {
    values.push(filters.protocol);
    conditions.push(
      `$${values.length} = ANY(protocols)`
    );
  }

  if (filters.status) {
    values.push(filters.status);
    conditions.push(
      `status = $${values.length}`
    );
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const countResult =
    await db.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM vpn_servers
        ${whereClause}
      `,
      values
    );

  const total = Number(
    countResult.rows[0]?.count ?? 0
  );

  const offset =
    (filters.page - 1) *
    filters.limit;

  const result =
    await db.query<ServerRow>(
      `
        SELECT
          id,
          country,
          country_code,
          city,
          hostname,
          public_key,
          protocols,
          status,
          latency_ms,
          load_percent,
          capacity,
          region
        FROM vpn_servers
        ${whereClause}
        ORDER BY
          CASE
            WHEN status = 'online'
            THEN 0
            ELSE 1
          END,
          load_percent ASC NULLS LAST,
          latency_ms ASC NULLS LAST
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
      `,
      [
        ...values,
        filters.limit,
        offset
      ]
    );

  return {
    servers: result.rows.map(mapServer),
    page: filters.page,
    limit: filters.limit,
    total
  };
}

export async function findServerById(
  serverId: string
): Promise<VPNServer | null> {
  const result =
    await db.query<ServerRow>(
      `
        SELECT
          id,
          country,
          country_code,
          city,
          hostname,
          public_key,
          protocols,
          status,
          latency_ms,
          load_percent,
          capacity,
          region
        FROM vpn_servers
        WHERE id = $1
        LIMIT 1
      `,
      [serverId]
    );

  const row = result.rows[0];

  return row
    ? mapServer(row)
    : null;
}
