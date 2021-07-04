import client from "./client";

export async function getStockProfile(ticker: string){
  const response = await client.get<StockProfile>(`/api/v3/profile/${ticker}`);
  return response.data
}


export interface StockProfile{
	symbol: string;
	country: string;
	cusip: string;
	cik: string;
	mktCap: number;
	city: string;
	dcf: number;
	companyName: string;
	changes: number;
	range: string;
	description: string;
	industry: string;
	ceo: string;
	volAvg: number;
	price: number;
	currency: string;
	exchangeShortName: string;
	state: string;
	sector: string;
	beta: number;
	defaultImage: boolean;
	zip: string;
	image: string;
	website: string;
	address: string;
	lastDiv: number;
	dcfDiff: number;
	isActivelyTrading: boolean;
	isEtf: boolean;
	fullTimeEmployees: string;
	phone: string;
	exchange: string;
	isin: string;
	ipoDate: string;
}

