import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

export class SwaggerUtil {
  async setup(app) {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('The API description')
      .setVersion('1.0')
      .addTag('api')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
  }
}
