import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

declare const module: any;

async function bootstrap() {
  // This is used to configure https on local server, if deploy on
  // Amazon EC2, it may need be replaced or removed
  const httpsOptions = {
    key: fs.readFileSync('./cert/RSA-privkey.pem'),
    cert: fs.readFileSync('./cert/RSA-cert.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  // const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Project X')
    .setDescription('Description for project X')
    .setVersion('1.0')
    .addTag('Project X')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
