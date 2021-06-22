require('dotenv').config();

const fsPromises = require('fs/promises')
const path = require('path')
const cliProgress = require('cli-progress')
const axios = require('axios').default;
const exec = require('child_process').exec

const tickerDir = path.resolve(__dirname, 'tickers')
const scriptsDir = path.resolve(__dirname, 'scripts/bulkSync')
const errorsDir = path.resolve(__dirname, 'errors-tickers.log')
const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

const markets = ['AMEX', 'NASDAQ', 'NYSE'];

async function parseTickers(market) {
  const data = await fsPromises.readFile(path.join(tickerDir, `${market}.txt`), 'utf8')
  const lines = data.split('\n');
  const tickers = lines
    .map((line) => line.split('\t')[0])
    .filter(ticker => !ticker.includes('.'))

  return tickers;
}

async function execCommand(command){
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if(error){
        console.log(stderr);
        reject(error)
      } else {
        resolve(stdout)
      }
    })
  })
}


const API_TOKEN = process.env.API_TOKEN
async function getHistoricalData({ticker, offset = 0, limit}){
  const response = await axios.get('http://api.marketstack.com/v1/eod', {
    params: {
      access_key: API_TOKEN,
      symbols: ticker,
      date_from: '1985-01-01',
      offset,
      limit
    }
  })

  return response.data;
}

async function getFullHistoricalData(ticker){
  const limit = 50;
  const firstData = await getHistoricalData({ticker, limit});
  const data = []
  data.push(...firstData.data);
  while(data.length !== firstData.pagination.total){
    const nextData = await  getHistoricalData({
      ticker,
      offset: data.length,
      limit
    })
    data.push(...nextData.data)
    // getFullHistoricalData(ticker)
  }
  return data;
}

async function doSomething(){
  const data = await getFullHistoricalData('MSFT');
  console.log(data.length)
}

doSomething()

async function bulkSync() {
  const tickersGroup = await Promise.all(markets.map(parseTickers))
  const tickers = [].concat(...tickersGroup);
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(tickers.length, 0);
  for(let i = 0; i < tickers.length; i++){

    try{
      // await execCommand(`${scriptsDir} ${tickers[i]}`)
      // @TODO
    } catch (e) {
      fsPromises.appendFile(errorsDir, `${tickers[i]}\n`, 'utf8')
    }
    await sleep(3000);
    bar.update(i + 1);
  }
}

// bulkSync('AMEX')
