import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import Syncbot from "./Syncbot";


createConnection().then(async (connection) => {
  const syncbot = new Syncbot();
  // await syncbot.syncStock('AAMC')
  // await syncbot.syncStocks()
  await syncbot.registerAssets()
  connection.close()
})

