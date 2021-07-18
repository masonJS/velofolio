import axios from 'axios';
import fs from 'fs'
import crypto from 'crypto';
import stream from 'stream'

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
  try{
    return new Promise(async (resolve, reject) => {

      const response = await axios.get(
        `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${symbol}.png`,
        { responseType: 'stream' })

      const hashStream = response.data.pipe(new stream.PassThrough())
      const fileStream = response.data.pipe(new stream.PassThrough())

      // @Todo stream 사용법에 대한 숙지가 필요
      const hash = await createHashFromStream(hashStream)
      if(hash === DEFAULT_IMAGE_HASH){
        const error = new Error('Logo image does not exist')
        error.name = 'LogoImageNotFoundError'
        reject(error)
        return
      }

      const file = fs.createWriteStream(dir)
      fileStream.pipe(file)
      file.on('error', (error) => {
        reject(error)
      })
      file.on('close', () => {
        resolve(true)
      })
    })
  } catch (e) {
    e.name = 'downloadStockLogo'
    console.log(e)
  }

}

