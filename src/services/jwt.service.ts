import { Injectable } from '@nestjs/common'

import { HttpService } from '@nestjs/axios'

import * as jwt from 'jsonwebtoken'
import * as jwkToPem from 'jwk-to-pem'

@Injectable()
export class JwtService {
  private httpService

  constructor() {
    this.httpService = new HttpService()
  }

  atob(base64) {
    var buffer = Buffer.from(base64, 'base64')
    var utf8 = buffer.toString('utf8') // Not "ascii"
    return utf8
  }

  async decodeToken(token) {
    const decode = jwt.decode(token, { complete: true })

    const result = await this.httpService
      .get(`${decode.payload.iss}/.well-known/jwks.json`)
      .toPromise()
    const jwk = result.data.keys.find((key) => {
      return key.kid === decode.header.kid
    })
    if (!jwk) {
      throw new Error("cognito's jwks is not found.")
    }

    const pem = jwkToPem(jwk)
    jwt.verify(
      token,
      pem,
      { algorithms: ['RS256'] },
      function (err, decodedToken) {
        if (err) {
          throw err
        }
      },
    )

    return decode.payload
  }
}
