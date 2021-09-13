import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

// import * as xRay from 'aws-xray-sdk-express';
import * as xRay from 'aws-xray-sdk'

@Injectable()
export class XrayInterceptor implements NestInterceptor {
  constructor(private httpAdapter: HttpAdapterHost) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...')

    let coverRoute = true
    const req = context.switchToHttp().getRequest()
    if (req.path === 'yourPath') {
      coverRoute = true
    }

    const now = Date.now()
    return next
      .handle()
      .pipe(
        tap(
          () =>
            coverRoute &&
            this.httpAdapter.httpAdapter.use(xRay.express.closeSegment()),
        ),
      )
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)))
  }
}
