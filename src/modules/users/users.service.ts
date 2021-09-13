import { Injectable } from '@nestjs/common'
import { DynamoService } from '../../services/dynamo.service'
import UserEntity from '../../db/dynamodb/model/UserEntity'
import { plainToClass } from 'class-transformer'
import { BaseService } from '../../lib/base.service'
import { CognitoService } from 'src/services/cognito.service'

@Injectable()
export class UsersService extends BaseService {
  /**
   * 登録・更新
   * @param params
   */
  async putUser(params): Promise<UserEntity> {
    const userMapper = await new DynamoService<UserEntity>().init(UserEntity)
    const entity = plainToClass(UserEntity, params)

    return await userMapper.save(entity, params)
  }

  async getUser(id: string): Promise<UserEntity> {
    // cognito確認（なしで）
    // const cognitoService = new CognitoService();
    // const cognitoUser = await cognitoService.getUser(id);

    const userMapper = await new DynamoService<UserEntity>().init(UserEntity)
    const params: any = {
      id: id,
    }
    const entity = plainToClass(UserEntity, params)
    return await userMapper.get(entity)
  }
}
