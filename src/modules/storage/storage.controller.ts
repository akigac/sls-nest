import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common'
import { StorageService } from './storage.service'
import { UsersService } from '../users/users.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { AllExceptionFilter } from '../../filter/all.exception.filter'
import { ApiTags } from '@nestjs/swagger'
import { XrayInterceptor } from '../../interceptor/xrayInterceptor'
import * as xRay from 'aws-xray-sdk'
import * as dayjs from 'dayjs'

@ApiTags('storage')
@UseFilters(AllExceptionFilter)
@Controller('storage')
@UseInterceptors(XrayInterceptor)
export class StorageController {
  constructor(
    private readonly service: StorageService,
    private readonly userService: UsersService,
  ) {}

  @Get('setUser/:id')
  async uploadUser(@Param() params) {
    const user = await this.userService.getUser(params.id)
    await this.service.uploadEntity(user)
    return user
  }

  @Get('downloadUser/:id')
  async downloadUser(@Param() params) {
    return JSON.stringify(await this.service.download(params.id))
  }
  @Get('downloadUser/:id/url')
  async downloadUserUrl(@Param() params) {
    const segment = xRay.getSegment()
    const subsegment = segment.addNewSubsegment(
      process.env.SERVICE! + '-download',
    )
    subsegment.addAnnotation('test', 'downloadUserUrl')
    subsegment.addAnnotation('test-12345', 'downloadUserUrl')
    subsegment.close()
    return JSON.stringify(await this.service.downloadUrl(params.id))
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param() params) {
    console.log('storage/uploadFile')
    await this.service.uploadFile(
      `${params.id}/${file.originalname}`,
      file.buffer,
    )
    return { message: 'success' }
  }
}
