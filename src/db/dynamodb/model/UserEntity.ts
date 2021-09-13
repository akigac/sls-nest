import * as v from 'class-validator'
import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations'
import BaseEntity from './BaseEntity'

@table(`User`)
export default class UserEntity extends BaseEntity {
  @hashKey()
  @v.IsString()
  id: string

  @v.IsOptional()
  @attribute()
  completed?: boolean
}
