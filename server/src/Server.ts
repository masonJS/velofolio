import fastify from "fastify";
import apiRoute from "./routes/api";
import searchPlugin from "./search/plugin";

const PORT = parseInt(process.env.PORT!, 10);
export default class Server {
  app = fastify({ logger : true })

  constructor() {
    this.setup()
  }

  setup(){
    this.app.register(searchPlugin)
    this.app.register(apiRoute, { prefix: '/api' })
  }

  start() {
    try{
      this.app.listen(PORT)
      this.app.log.info(`Server is running with port ${PORT}`)
    } catch (e) {
      this.app.log.error(e)
    }
  }
}
