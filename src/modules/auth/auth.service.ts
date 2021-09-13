import { Injectable } from '@nestjs/common'
import { BaseService } from '../../lib/base.service'
import { CognitoService } from '../../services/cognito.service'
import { UsersService } from '../users/users.service'
import { JwtService } from '../../services/jwt.service'

@Injectable()
export class AuthService extends BaseService {
  private cognitoService: CognitoService

  constructor() {
    super()
    this.cognitoService = new CognitoService()
  }

  /**
   * 登録
   * @param params
   */
  async signup(params) {
    await this.cognitoService.signup(params)
    return { status: 'ok' }
  }
  /**
   * 新規登録後の検証コード確認
   */
  async confirm(params) {
    // await this.cognitoService.confirm(params)
  }
  /**
   * ログイン
   */
  async signIn(params) {
    return await this.cognitoService.signIn(params)
  }
  /**
   * 初回認証
   */
  async challenge(params) {
    const result = await this.cognitoService.challenge(params)
    if (result) {
      const jwtService = new JwtService()
      const decode = await jwtService.decodeToken(result.AccessToken)
      console.log(decode)

      // ユーザー作成
      const userService = new UsersService()
      await userService.putUser({
        id: decode.sub,
        updateDate: new Date(),
      })
    }
    return result
  }
}
