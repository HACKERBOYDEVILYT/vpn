import type {
  FavoriteServer
} from "@nexavpn/types";

import {
  findServerById
} from "../servers/repository.js";

import {
  listFavorites,
  addFavorite,
  removeFavorite
} from "./repository.js";

export async function getUserFavorites(
  userId: string
): Promise<FavoriteServer[]> {
  return listFavorites(userId);
}

export async function createFavorite(
  userId: string,
  serverId: string
): Promise<FavoriteServer> {
  const server =
    await findServerById(serverId);

  if (!server) {
    throw new Error(
      "SERVER_NOT_FOUND"
    );
  }

  return addFavorite(
    userId,
    serverId
  );
}

export async function deleteFavorite(
  userId: string,
  serverId: string
): Promise<boolean> {
  return removeFavorite(
    userId,
    serverId
  );
}
