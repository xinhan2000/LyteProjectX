import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Oauth2Controller } from './oauth2.controller';
import { Oauth2Service } from './oauth2.service';

@Module({
  imports: [HttpModule],
  controllers: [Oauth2Controller],
  providers: [Oauth2Service],
})
export class Oauth2Module {}
