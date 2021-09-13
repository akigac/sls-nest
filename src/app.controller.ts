import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { AppService } from './app.service'
import * as crypto from 'crypto'
import { execSync } from 'child_process'
import { XrayInterceptor } from './interceptor/xrayInterceptor'

@Controller()
@UseInterceptors(XrayInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('getCrypto')
  getCrypt(@Query() query: { key: string }): string {
    const key = query.key ?? 'test'
    const strHash = crypto.createHash('sha256').update(key).digest('hex')
    return strHash
  }

  @Get('getOpensslVersion')
  async openssl(): Promise<string> {
    // Synchronous command
    const stdout = execSync('openssl version')
    const data = stdout.toString()
    return data
  }
}
