import * as fs from 'fs/promises'
import * as path from 'path'
import { getStockProfile } from "../finance-api/getStockProfile";
import { getSectorWeightings } from "../finance-api/getSectorWeightings";
import { getHistoricalPrices } from "../finance-api/getHistoricalPrices";
import { groupByMonth } from "./lib/groupByMonth";
import { Asset } from "../entity/Asset";
import { downloadStockLogo } from "./lib/downloadStockLogo";
import { getRepository } from "typeorm";
import { AssetType } from "../entity/AssetType";
import { AssetMeta } from "../entity/AssetMeta";
import { SectorWeighting } from "../entity/SectorWeighting";
import { HistoricalPrice } from "../entity/HistoricalPrice";
import cliProgress from 'cli-progress';

const tickersDir = path.resolve(__dirname, 'tickers')
const LIMIT = 5
const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration, []))

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
    const exists = await getRepository(Asset).findOne({ where: { ticker }})
    if(exists) return exists
    const assetType = await getRepository(AssetType).findOne({
      where: {
        type: 'U.S. Asset'
      }
    })

    const [profile, rawHistoricalPrices]  = await Promise.all([
      getStockProfile(ticker),
      getHistoricalPrices(ticker)
    ]);
    const monthlyHistoricalPrices = groupByMonth(rawHistoricalPrices)
    const asset = new Asset()
    asset.name = profile.companyName
    asset.description = profile.description
    asset.asset_type = assetType
    asset.ipo_date = new Date(profile.ipoDate)
    asset.is_etf = profile.sector === ''
    asset.sector = profile.sector || null
    asset.ticker = ticker

    try{
      const imageDir = path.resolve(
        __dirname,
        'logos/us_stocks',
        `${ticker}.png`
      )
      await downloadStockLogo(ticker, imageDir)
      asset.image = `logos/us_stock/${ticker}.png`
    } catch (e) {
    }

    const assetMeta = new AssetMeta()
    assetMeta.asset = asset
    assetMeta.price = profile.price
    assetMeta.changes = profile.changes
    assetMeta.is_tracking = false
    assetMeta.market_cap = profile.mktCap
    await getRepository(AssetMeta).save(assetMeta) // AssetMeta & Asset save

    const sectorWeightingsData = profile.sector === '' ? await getSectorWeightings(ticker) : null

    if(sectorWeightingsData){
      const sectorWeightings = sectorWeightingsData.map((sw) => {
        const sectorWeighting = new SectorWeighting()
        sectorWeighting.asset = asset
        sectorWeighting.percentage = parseFloat(sw.weightPercentage)
        sectorWeighting.sector = sw.sector
        return sectorWeighting
      })
      // save(entries[]) => 복수개(plural) save 가능
      await getRepository(SectorWeighting).save(sectorWeightings)
    }

    const historicalPrices = monthlyHistoricalPrices.map(mhp => {
      const historicalPrice = new HistoricalPrice()
      historicalPrice.asset = asset
      historicalPrice.volume = mhp.volume
      historicalPrice.close = mhp.close
      historicalPrice.date = new Date(mhp.closeDate)
      historicalPrice.high = mhp.high
      historicalPrice.low = mhp.low
      historicalPrice.type = 'monthly'
      historicalPrice.open = mhp.open
      historicalPrice.adjusted_close = mhp.adjustedClose
      return historicalPrice
    })

    await getRepository(HistoricalPrice).save(historicalPrices)
    return asset
  }

  async syncStocks(){
    const tickers = await this.loadTickers()
    const bar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    )

    const errorsDir = path.resolve(__dirname, 'error_tickers.txt')
    bar.start(tickers.length, 0)

    let busyWorkers = 0
    const failedTickers: string[] = []

    while(tickers.length > 0 || busyWorkers !== 0){
      if(busyWorkers >= LIMIT || tickers.length === 0){
        await sleep(6)
        continue
      }
      busyWorkers += 1
      const ticker = tickers.pop()
      console.log('START: ', busyWorkers)
      this.syncStock(ticker!)
        .catch((e) => {
          console.log(e)
          console.log(`Error: ${ticker}`)
          failedTickers.push(ticker)
          fs.appendFile(errorsDir, `${ticker}\n`, 'utf8')
        })
        .finally(() => {
          busyWorkers -= 1
          console.log('END: ', busyWorkers)
          bar.increment(1)
      })
    }
    console.log('FINISH')
    bar.stop()
  }
}

export default Syncbot
