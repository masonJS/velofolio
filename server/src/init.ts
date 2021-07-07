import 'dotenv/config'
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { AssetType } from "./entity/AssetType";

createConnection().then(async (connection) => {
  const repo = getRepository(AssetType);
  const stockType = await repo.find();
  if(stockType.length > 0){
    console.error('SymbolType is already initialized')
    connection.close()
  }
  const usStock = new AssetType();
  usStock.type = 'U.S. Asset';
  await repo.save(usStock);
  console.log('SymbolType is now initialized')
  connection.close()
})
