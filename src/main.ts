import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerUtil } from './lib/SwaggerUtil';

// local setting
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerUtil = new SwaggerUtil();
  await swaggerUtil.setup(app);
  await app.listen(3000);
}
bootstrap();
