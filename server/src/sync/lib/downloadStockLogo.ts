import axios from 'axios';
import * as fs from 'fs'
import * as crypto from 'crypto';


const DEFAULT_IMAGE_HASH = '64b13a165031c95f2de9aacb3b90057a'

function createHashFromStream(stream: fs.ReadStream){
  return new Promise((resolve) => {
    const md5 = crypto.createHash('md5');
    stream.on('data', (buffer) => {
      md5.update(buffer)
    })
    stream.on('end', () => {
      resolve(md5.digest('hex'))
    })
  })
}

export function downloadStockLogo(symbol: string, dir:string){
  return new Promise(async (resolve, reject) => {
    const file = fs.createWriteStream(dir);

    const response = await axios.get(
      `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${symbol}.png`,
      { responseType: 'stream' })

    // @Todo stream 사용법에 대한 숙지가 필요
    // const hash = await createHashFromStream(response.data)
    // if(hash === DEFAULT_IMAGE_HASH){
    //   const error = new Error('Logo image does not exist')
    //   error.name = 'LogoImageNotFoundError'
    //   reject(error)
    //   return
    // }

    response.data.pipe(file);
    file.on('close', () => {
     resolve(true)
    })
    file.on('error', (error) => {
      reject(error)
    })
  })
}

