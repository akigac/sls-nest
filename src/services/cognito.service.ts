import { Injectable } from '@nestjs/common'
import { CognitoIdentityServiceProvider } from 'aws-sdk'

export class CognitoService {
  private cognito: CognitoIdentityServiceProvider

  constructor() {
    const region = process.env.AWS_REGION ?? 'ap-northeast-1'
    this.cognito = new CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18',
    })
  }

  /**
   * ユーザー登録
   * @param user
   */
  async signup(user: {
    email: string // email
    password: string
  }): Promise<any> {
    console.log(user)
    let data = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: user.email,
    }
    try {
      await this.cognito.adminGetUser(data).promise()
    } catch (e) {
      // data['Password'] = user.password;
      // const registUser = Object.assign(data, {"Password": user.password})
      // console.log(registUser)
      return await this.cognito.adminCreateUser(data).promise()
    }
    // await this.cognito.signUp(data).promise()

    throw new Error('user exists.')
  }

  /**
   * ログイン処理
   * @param user
   */
  async signin(user: { email: string; password: string }): Promise<any> {
    const data = {
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      UserPoolId: process.env.USER_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: user.email,
        PASSWORD: user.password,
      },
    }
    const result = await this.cognito.adminInitiateAuth(data).promise()

    // 初回は仮パスワード認証用のレスポンスが返却される
    return result.AuthenticationResult ?? result
  }
  /**
   * 初回認証
   * @param user
   */
  async challenge(user: {
    email: string
    password: string
    challengeName: string
    session: string
  }): Promise<any> {
    const new_user = {
      USERNAME: user.email,
      NEW_PASSWORD: user.password,
    }

    const data = {
      UserPoolId: process.env.USER_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID,
      ChallengeName: user.challengeName,
      Session: user.session,
      ChallengeResponses: new_user,
    }
    const result = await this.cognito
      .adminRespondToAuthChallenge(data)
      .promise()

    return result.AuthenticationResult
  }

  /**
   * ユーザー登録
   * @param user
   */
  async getUser(accessToken: string): Promise<any> {
    // console.log(accessToken)
    let data = {
      UserPoolId: process.env.USER_POOL_ID,
      AccessToken: accessToken,
    }
    try {
      return await this.cognito.getUser(data).promise()
    } catch (e) {
      throw new Error('user exists.')
    }
    // await this.cognito.signUp(data).promise()
  }
}
