import type { ServerCity, ServerRegion } from "./region-types.js";

export const SERVER_REGIONS: ServerRegion[] = [
  {
    code: "SG",
    slug: "singapore",
    name: "Singapore",
    enabled: true
  },
  {
    code: "JP",
    slug: "japan",
    name: "Japan",
    enabled: true
  },
  {
    code: "US",
    slug: "usa",
    name: "United States",
    enabled: true
  },
  {
    code: "DE",
    slug: "germany",
    name: "Germany",
    enabled: true
  },
  {
    code: "GB",
    slug: "uk",
    name: "United Kingdom",
    enabled: true
  },
  {
    code: "IN",
    slug: "india",
    name: "India",
    enabled: true
  }
];

export const SERVER_CITIES: ServerCity[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    regionCode: "IN"
  },
  {
    slug: "delhi",
    name: "Delhi",
    regionCode: "IN"
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    regionCode: "IN"
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    regionCode: "IN"
  },
  {
    slug: "chennai",
    name: "Chennai",
    regionCode: "IN"
  }
];
