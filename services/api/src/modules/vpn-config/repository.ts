import {
  db
} from "../../database/client.js";

interface ServerConfigRow {
  id: string;
  hostname: string;
  public_key: string;
  protocols: string[];
  status: string;
}

export async function getServerVPNConfig(
  serverId: string
): Promise<ServerConfigRow | null> {
  const result =
    await db.query<ServerConfigRow>(
      `
        SELECT
          id,
          hostname,
          public_key,
          protocols,
          status
        FROM vpn_servers
        WHERE id = $1
        LIMIT 1
      `,
      [serverId]
    );

  return (
    result.rows[0] ?? null
  );
}
