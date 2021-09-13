import { Module } from '@nestjs/common'
import { StorageController } from './storage.controller'
import { StorageService } from './storage.service'
import { UsersService } from '../users/users.service'

@Module({
  imports: [],
  controllers: [StorageController],
  // 別modulesのserviceはよくない気がする
  providers: [StorageService, UsersService],
})
export class StorageModule {}
