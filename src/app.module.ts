import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { StorageModule } from './modules/storage/storage.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [UsersModule, StorageModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
