import { Injectable } from '@nestjs/common';
import { DynamoService } from '../../services/dynamo.service';
import UserEntity from '../../db/dynamodb/model/UserEntity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {

  /**
   * 登録・更新
   * @param params
   */
  async putUser(params): Promise<UserEntity> {
    const userMapper = await new DynamoService<UserEntity>().init(UserEntity);
    const entity = plainToClass(UserEntity, params);

    return await userMapper.save(entity, params);
  }

  async getUser(id: string): Promise<UserEntity> {
    const userMapper = await new DynamoService<UserEntity>().init(UserEntity);
    const params: any = {
      id: id,
    };
    const entity = plainToClass(UserEntity, params);
    return await userMapper.get(entity);
  }
}
