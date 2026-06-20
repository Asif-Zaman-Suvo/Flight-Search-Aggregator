export interface SearchParams {
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
  passengers: number;
  cabinClass?: string;
}
