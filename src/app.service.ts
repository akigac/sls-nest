import { Injectable } from '@nestjs/common'
import { BaseService } from './lib/base.service'

@Injectable()
export class AppService extends BaseService {
  getHello(): string {
    return 'Hello World!'
  }
}
