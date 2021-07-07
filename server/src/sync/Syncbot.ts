import * as fs from 'fs/promises'
import * as path from 'path'
import {getStockProfile} from "../finance-api/getStockProfile";
import {getSectorWeightings} from "../finance-api/getSectorWeightings";
import {getHistoricalPrices} from "../finance-api/getHistoricalPrices";
import {groupByMonth} from "./lib/groupByMonth";
import {Asset} from "../entity/Asset";

const tickersDir = path.resolve(__dirname, 'tickers')

class Syncbot {
  async parseTickers(name: string){
    const data = await fs.readFile(path.join(tickersDir, `${name}.txt`), 'utf8')
    const lines = data.split('\n');
    const tickers = lines
      .map((line) => line.split('\t')[0])
      .filter(ticker => !ticker.includes('.') && ticker)

    return tickers;
  }

  async loadTickers() {
    const tickers = await this.parseTickers('INITIAL')
    return tickers
  }

  async syncStock(ticker: string){
    const [profile, historicalPrices]  = await Promise.all([
      getStockProfile(ticker),
      getHistoricalPrices(ticker)
    ]);
    const sectorWeightings = profile.sector ? await getSectorWeightings(ticker) : null;
    const monthlyHistoricalPrices = groupByMonth(historicalPrices);
    const stock = new Asset();
    // stock.
  }

  async syncStocks(){
    // const tickers = await this.loadTickers()
    // const profile = await getStockProfile('VV')
    // const sectorWeightings = await getSectorWeightings('VV')
    // const historicalPrice = await getHistoricalPrices('VV');
  }
}

export default Syncbot
