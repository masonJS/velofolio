import { FastifyPluginCallback } from "fastify";
import { Asset } from "../../entity/Asset";
import { getRepository } from "typeorm";

const assetsRoute: FastifyPluginCallback = (fastify, opts, done) => {

  fastify.get<{ Querystring: { keyword: string }}>(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            keyword: { type: 'string' }
          },
          required: ['keyword']
        }
      }
    }, (request, reply) => {
    const results = fastify.searchEngine.search(request.query.keyword).slice(0, 10).map(result => ({
      id: result.item.id,
      ticker: result.item.ticker,
      image: result.item.image
    }))
    // console.log((fastify as any).search)
    reply.send(results)
  })

  fastify.get<{ Params: { ticker: string }}>(
    '/:ticker',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            ticker: { type: 'string' }
          },
          required: ['ticker']
        }
      }
    },
    async (request, reply) => {
      const asset = await getRepository(Asset).findOne({
        where: { ticker: request.params.ticker }
        })
      if(!asset){
        reply.status(404)
        throw new Error('Asset is not found')
      }
      reply.send(asset)
    })
  done()
}

export default assetsRoute
