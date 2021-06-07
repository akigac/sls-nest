import { Injectable } from '@nestjs/common';
import { S3Service } from '../../services/s3.service';

@Injectable()
export class StorageService {
  async uploadFile(path, buffer: Buffer) {
    const s3 = new S3Service();
    await s3.upload(path, buffer);
  }

  async uploadEntity(entity) {
    const s3 = new S3Service();
    const data = JSON.stringify(entity);
    await s3.upload(`${entity.id}.json`, data);
  }

  async download(id) {
    const s3 = new S3Service();
    const result = await s3.download(`${id}.json`);
    if (result.Body) {
      return JSON.parse(result.Body.toString('utf-8'));
    } else {
      return { message: 'down load error.' };
    }
    // console.log(result);
  }
}
