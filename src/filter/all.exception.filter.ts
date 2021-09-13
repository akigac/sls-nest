import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost): any {
    console.log('host', host)
    console.log(exception)
    return {
      status: 'error',
      message: exception,
    }
  }
}
