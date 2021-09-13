import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CognitoService } from 'src/services/cognito.service'

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, CognitoService],
  exports: [AuthService, CognitoService],
})
export class AuthModule {}
