import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Oauth2Module } from './oauth2/oauth2.module';
import { Oauth2Controller } from './oauth2/oauth2.controller';
import { Oauth2Service } from './oauth2/oauth2.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../database/database_config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DataSource } from 'typeorm';

import { join } from 'path';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'webapp/dist'),
      serveRoot: '/',
    }),
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '/ssr'),
      rootPath: join(__dirname, '../..', 'webapp/ssr'),
      serveRoot: '/ssr',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    HttpModule,
    Oauth2Module,
  ],
  controllers: [AppController, Oauth2Controller],
  providers: [AppService, Oauth2Service],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
