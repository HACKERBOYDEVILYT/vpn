import {
  queryServers
} from "./server-query.js";

import {
  buildServerCandidates
} from "./server-candidates.js";

import {
  serverRepository
} from "./repository.js";

export async function discoverServers(
  options: {
    regionCode?: string;
    city?: string;
  } = {}
) {
  const servers =
    await queryServers(
      serverRepository,
      {
        regionCode:
          options.regionCode,
        city:
          options.city,
        enabledOnly: true
      }
    );

  return buildServerCandidates(
    servers
  );
}
