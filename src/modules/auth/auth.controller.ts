import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseInterceptors,
  Headers,
  Query,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags } from '@nestjs/swagger'
import { XrayInterceptor } from '../../interceptor/xrayIntorseptor'

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(XrayInterceptor)
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Put('signup')
  async signup(@Body() body) {
    try {
      console.log('start signup.')
      // console.log(body)
      // return;
      const result = await this.service.signup(body)
      console.log(result)
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }
  /**
   * メール＆パスワードで認証
   * @param body
   * @returns
   */
  @Post('signIn')
  async signIn(@Body() body) {
    try {
      console.log('start signIn.')

      // console.log(body)
      // return;
      return await this.service.signIn(body)
    } catch (e) {
      return e
    }
  }
  /**
   * 初回のsignup後に、送られたパスワードでコード認証する
   * @param body
   * @returns
   */
  @Post('challenge')
  async challenge(@Body() body) {
    try {
      console.log('start challenge.')
      // console.log(body)
      // return;
      return await this.service.challenge(body)
    } catch (e) {
      console.log(e)
      return e
    }
  }
}
