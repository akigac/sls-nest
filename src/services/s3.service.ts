import { S3 } from 'aws-sdk';

export class S3Service {
  private readonly s3;
  private readonly bucket: string;

  constructor(bucket = process.env.STORAGE_BUCKET) {
    const region = process.env.AWS_REGION ?? 'ap-northeast-1';
    this.s3 = new S3({
      region: region,
    });
    this.bucket = bucket;
  }

  async upload(path: string, data: any): Promise<any> {
    const params = {
      Bucket: this.bucket,
      Key: path,
      ServerSideEncryption: 'AES256',
      Body: data,
    };
    return this.s3.putObject(params).promise();
  }
  async download(path): Promise<any> {
    const params = {
      Bucket: this.bucket,
      Key: path,
    };
    return this.s3.getObject(params).promise();
  }
}
