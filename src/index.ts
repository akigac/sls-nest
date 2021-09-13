import { Context, Handler } from 'aws-lambda'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Server } from 'http'
import { ExpressAdapter } from '@nestjs/platform-express'
import { createServer, proxy } from 'aws-serverless-express'
import * as express from 'express'
import { SwaggerUtil } from './lib/SwaggerUtil'
import * as awsXray from 'aws-xray-sdk'

let cachedServer: Server

// lambda setting
async function bootstrapServer(): Promise<Server> {
  const expressApp = express()
  const adapter = new ExpressAdapter(expressApp)
  const app = await NestFactory.create(AppModule, adapter)
  app.use(awsXray.express.openSegment(process.env.SERVICE))
  const swaggerUtil = new SwaggerUtil()
  await swaggerUtil.setup(app)
  app.enableCors()
  // enable onModuleDestroy(), beforeApplicationShutdown() and onApplicationShutdown()
  app.enableShutdownHooks()
  await app.init()
  return createServer(expressApp)
}

export const handler: Handler = async (event: any, context: Context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer()
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise
}
