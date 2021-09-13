import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Body,
  UseInterceptors,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiTags } from '@nestjs/swagger'
import { XrayInterceptor } from '../../interceptor/xrayInterceptor'

import { JwtService } from '../../services/jwt.service'

@ApiTags('user')
@Controller('users')
@UseInterceptors(XrayInterceptor)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('sample')
  async sample(@Param() params) {
    try {
      console.log('start sample.')
      return await this.service.putUser({
        id: '1234567',
        updateDate: new Date(),
      })
    } catch (e) {
      console.log(e)
    }
    return {}
  }

  @Put(':id')
  async putUser(@Param() params) {
    try {
      return await this.service.putUser(params.id)
    } catch (e) {
      console.log(e)
    }
    return {}
  }
  @Get(':id')
  async getUser(@Param() params) {
    try {
      return (await this.service.getUser(params.id)) ?? { message: 'no data.' }
    } catch (e) {
      console.log(e)
    }
    return {}
  }

  /**
   * 初回のsignup後に、送られたパスワードでコード認証する
   * @param accessToken
   */
  @Post('me')
  async me(@Body('accessToken') accessToken) {
    try {
      console.log('start me.')

      const jwtService = new JwtService()
      const decode = await jwtService.decodeToken(accessToken)

      const user = await this.service.getUser(decode.sub)
      if (!user) {
        throw new Error('user not exists.')
      }

      return user
    } catch (e) {
      console.log(e)
      return e
    }
  }
}
