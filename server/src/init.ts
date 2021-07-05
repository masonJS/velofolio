import 'dotenv/config'
import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import {StockType} from "./entity/StockType";

createConnection().then(async (connection) => {
  const repo = getRepository(StockType);
  const stockType = await repo.find();
  if(stockType.length > 0){
    console.error('SymbolType is already initialized')
    connection.close()
  }
  const usStock = new StockType();
  usStock.type = 'U.S. Stock';
  await repo.save(usStock);
  console.log('SymbolType is now initialized')
  connection.close()
})
