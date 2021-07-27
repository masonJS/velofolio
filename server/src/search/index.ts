import 'dotenv/config'
import "reflect-metadata"
import { createConnection, getRepository } from "typeorm"
import { Asset } from "../entity/Asset"
import Fuse from 'fuse.js'
import Fastify from "fastify";
import fs from 'fs'
import path from 'path'

createConnection()
  .then(async (connection) => {
    const repo = getRepository(Asset)

    const assets = await repo.find()
    // const index = Fuse.createIndex(['name', 'ticker'], assets)

    // fs.writeFileSync(
    //   path.resolve(__dirname, 'fuse-index.json'),
    //   JSON.stringify(index.toJSON())
    // )

    const fuse = new Fuse(assets, {
      useExtendedSearch: true,
      includeScore: true,
      findAllMatches: false,
      distance: 4,
      threshold: 0.2,
      keys: [
        {
          name: 'name',
          weight: 1
        },
        {
          name: 'ticker',
          weight: 3
        }
      ]
    })

    const keyword = 'first'

    const result = fuse.search({
      $or: [
        {
          ticker: `^${keyword}`
        },
        {
          name: `'${keyword}`
        }
      ]
    })

    // console.log(result)

    const fastify = Fastify({ logger: true })
    fastify.get('/', (request, reply) => {
      const { keyword } = request.query as { keyword: string }
      console.log(keyword)
      const result = fuse.search({
        $or: [
          {
            ticker: `^${keyword}`,
          },
          {
            name: `'${keyword}`
          }
        ]
      })
      reply.send(result)
    })
    fastify.listen(process.env.SEARCH_PORT, () => {
      fastify.log.info(`server is listening on ${process.env.SEARCH_PORT}`)
    })

  })
  .catch((error) => console.log(error))
