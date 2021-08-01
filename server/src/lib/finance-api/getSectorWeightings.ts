import client from "./client";

export async function getSectorWeightings(ticker: string){
  const response = await client.get<SectorWeightings[]>(`/api/v3/etf-sector-weightings/${ticker}`);
  return response.data
}

export interface SectorWeightings {
	weightPercentage: string;
	sector: string;
}

