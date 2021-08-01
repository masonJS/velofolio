import { FastifyPluginCallback } from "fastify";

const assetsRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get('/', (request, reply) => {
    console.log((fastify as any).search)
    reply.send([])
  })
  done()
}

export default assetsRoute
