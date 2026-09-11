import {
  SERVER_CITIES,
  SERVER_REGIONS
} from "./region-catalog.js";

export function listRegions() {
  return SERVER_REGIONS.filter((region) => region.enabled);
}

export function findRegion(codeOrSlug: string) {
  const value = codeOrSlug.toLowerCase();

  return SERVER_REGIONS.find(
    (region) =>
      region.code.toLowerCase() === value ||
      region.slug.toLowerCase() === value
  );
}

export function listCities(regionCode: string) {
  return SERVER_CITIES.filter(
    (city) =>
      city.regionCode.toLowerCase() === regionCode.toLowerCase()
  );
}
