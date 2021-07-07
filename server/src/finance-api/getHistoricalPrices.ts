import client from "./client";

type Duration = {
  from?: string,
  to?: string
}

export async function getHistoricalPrices(ticker: string, duration?: Duration){
  const response = await client.get<getHistoricalResult>(
    `/api/v3/historical-price-full/${ticker}`,
    {
      params: duration
    }
  );
  return response.data.historical
}

export interface RawHistoricalPrice {
  date: string;
  change: number;
  vwap: number;
  label: string;
  volume: number;
  high: number;
  unadjustedVolume: number;
  adjClose: number;
  low: number;
  changeOverTime: number;
  changePercent: number;
  close: number;
  open: number;
}

type getHistoricalResult = {
  symbol: string,
  historical: RawHistoricalPrice[]
}
