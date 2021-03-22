import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as crypto from 'crypto';
import { execSync } from 'child_process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('crypto')
  getCrypt(): string {
    const strHash = crypto.createHash('sha256').update('test').digest('hex');
    return strHash;
  }

  @Get('getOpensslVersion')
  async openssl() {
    // Synchronous command
    const stdout = execSync('bin version');
    const data = stdout.toString();
    return data;
  }
}
