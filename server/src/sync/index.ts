import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import Syncbot from "./Syncbot";
import { downloadStockLogo } from "./lib/downloadStockLogo";
import * as path from "path";

downloadStockLogo('ABNB', path.resolve(__dirname, `logos/us_stocks/SAMPLE.png`))

createConnection().then((connection) => {
  const syncbot = new Syncbot();
  syncbot.syncStocks()
})

