import * as fs from 'fs/promises'
import * as path from 'path'
import {getStockProfile} from "../finance-api/getStockProfile";
import {getSectorWeightings} from "../finance-api/getSectorWeightings";

const tickersDir = path.resolve(__dirname, 'tickers')

class Syncbot {
  async parseTickers(name: string){
    const data = await fs.readFile(path.join(tickersDir, `${name}.txt`), 'utf8')
    const lines = data.split('\n');
    const tickers = lines
      .map((line) => line.split(' ')[0])
      .filter(ticker => !ticker.includes('.') && ticker)

    return tickers;
  }
  async loadTickers() {
    const tickers = await this.parseTickers('INITIAL')
    const profile = await getStockProfile('VV')
    const sectorWeightings = await getSectorWeightings('VV')
    return tickers
  }
  async syncStocks(){
    const tickers = await this.loadTickers()
  }

}

export default Syncbot
