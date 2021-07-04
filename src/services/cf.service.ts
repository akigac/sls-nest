import { CloudFront } from 'aws-sdk';
// import 'dayjs/locale/es';
import * as dayjs from 'dayjs';

export class CFService {
  private readonly signer;

  constructor() {
    const keyPair = process.env.KEY_PAIR_ID;
    const privateKey = process.env.PRIVATE_KEY;
    this.signer = new CloudFront.Signer(keyPair, privateKey);
  }

  signedUrl(uri: string) {
    const expires = dayjs(new Date()).add(1, 'minute').unix();
    return this.signer.getSignedUrl({
      url: process.env.CLOUD_FRONT_URL + '/' + uri,
      expires: expires, // UTC Timestamp
    });
  }
}
