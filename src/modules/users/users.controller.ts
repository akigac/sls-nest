import { Controller, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('sample')
  async sample(@Param() params) {
    try {
      console.log('start sample.');
      return await this.service.putUser({
        id: '1234567',
        updateDate: new Date(),
      });
    } catch (e) {
      console.log(e);
    }
    return {};
  }

  @Put(':id')
  async putUser(@Param() params) {
    try {
      return await this.service.putUser(params.id);
    } catch (e) {
      console.log(e);
    }
    return {};
  }
  @Get(':id')
  async getUser(@Param() params) {
    try {
      return (await this.service.getUser(params.id)) ?? { message: 'no data.' };
    } catch (e) {
      console.log(e);
    }
    return {};
  }
}
