import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { client, client_auth_info, client_bank_info, client_web_hooks, company, company_auth_info, employer, company_plugin, user, user_auth_info, user_payout, pay_summary, pay_item, pay_activity } from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'projectx',
      entities: [client, client_auth_info, client_bank_info, client_web_hooks, company, company_auth_info, employer, company_plugin, user, user_auth_info, user_payout, pay_summary, pay_item, pay_activity],
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor(private dataSource: DataSource) { }
}

