import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import Shopify, { ApiVersion } from '@shopify/shopify-api';

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

  Shopify.Context.initialize({
    API_KEY: 'e4a04548696b828ddbcc4a4aa7fc7f73',
    API_SECRET_KEY: '4d55a3ad58a418d80d58b679f9b334f7',
    SCOPES: ['read_payment_terms', 'read_shopify_payments_payouts'],
    HOST_NAME: 'projectx.i234.me',
    HOST_SCHEME: 'HTTPS',
    IS_EMBEDDED_APP: false,
    API_VERSION: ApiVersion.October22, // all supported versions are available, as well as "unstable" and "unversioned"
  });

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
