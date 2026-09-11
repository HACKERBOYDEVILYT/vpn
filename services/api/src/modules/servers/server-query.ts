import type { ServerRepository } from "./repository.js";

export type ServerQueryOptions = {
  regionCode?: string;
  city?: string;
  enabledOnly?: boolean;
};

export async function queryServers(
  repository: ServerRepository,
  options: ServerQueryOptions = {}
) {
  const servers = await repository.list();

  return servers.filter((server: any) => {
    if (
      options.enabledOnly &&
      server.enabled === false
    ) {
      return false;
    }

    if (
      options.regionCode &&
      String(server.regionCode ?? "").toLowerCase() !==
        options.regionCode.toLowerCase()
    ) {
      return false;
    }

    if (
      options.city &&
      String(server.city ?? "").toLowerCase() !==
        options.city.toLowerCase()
    ) {
      return false;
    }

    return true;
  });
}
