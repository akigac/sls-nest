import { DataMapper } from '@aws/dynamodb-data-mapper';

import { DynamoDB } from 'aws-sdk';
import { plainToClass } from 'class-transformer';

export class DynamoService<T> {
  private readonly mapper: DataMapper;
  private entity;

  constructor() {
    const region = process.env.AWS_REGION ?? 'us-west-2';
    this.mapper = new DataMapper({
      client: new DynamoDB({ region: region }), // the SDK client used to execute operations
      // tableNamePrefix: 'dev_', // optionally, you can provide a table prefix to keep your dev and prod tables separate
    });
  }
  async init(entity) {
    await this.mapper.ensureTableExists(entity, {
      writeCapacityUnits: 1,
      readCapacityUnits: 1,
    });
    this.entity = entity;
    return this;
  }

  async get(entity: T): Promise<T> {
    try {
      return await this.mapper.get<T>({ item: entity });
    } catch (e) {
      if (e.toString().match(/ItemNotFoundException/)) return;
      throw e;
    }
  }

  async put(entity: T): Promise<T> {
    return await this.mapper.put<T>(entity);
  }

  async update(entity: T): Promise<T> {
    return await this.mapper.update<T>(entity);
  }

  async save(entity: T, params): Promise<T> {
    const data = await this.get(entity);
    if (!data) {
      return await this.put(entity);
    }

    for (const [key, value] of Object.entries(params)) {
      if (key !== 'id') {
        data[key] = value;
      }
    }
    return await this.update(data);
  }

  async findById(id: string) {
    const entity = plainToClass(this.entity, { id: id });
    return await this.get(<T>entity);
  }

  async scanByIndex(params, index: string): Promise<T[]> {
    const entityList: T[] = [];
    for await (const item of this.mapper.scan<T>(params, {
      indexName: index,
    })) {
      entityList.push(item);
    }

    return entityList;
  }
}
