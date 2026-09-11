export type ServerRegion = {
  code: string;
  slug: string;
  name: string;
  enabled: boolean;
};

export type ServerCity = {
  slug: string;
  name: string;
  regionCode: string;
};

export type ServerLocation = {
  region: ServerRegion;
  city: ServerCity;
};
