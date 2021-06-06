import * as v from 'class-validator';
import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export default class BaseEntity {
  @v.IsOptional()
  @attribute({ defaultProvider: () => new Date() })
  createDate?: Date;

  @v.IsOptional()
  @attribute({ defaultProvider: () => new Date() })
  updateDate?: Date;
}
