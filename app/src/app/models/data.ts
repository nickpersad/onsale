export interface Metadata {
  titles: string[] | null;
  companies: string[] | null;
}

export interface Search {
  count: number | null;
  results: Item[];
}

export interface Item {
  title: string | null;
  description: string | null;
  price?: string | null;
  savings?: string | null;
  store: string | null;
  image: string | null;
  favorite?: boolean | null;
}