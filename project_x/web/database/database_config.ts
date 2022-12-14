import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  client,
  client_auth_info,
  client_bank_info,
  client_web_hooks,
  company,
  company_auth_info,
  employer,
  company_plugin,
  user,
  user_auth_info,
  user_payout,
  pay_summary,
  pay_item,
  pay_activity,
} from '../database/entities';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'projectx',
  entities: [
    client,
    client_auth_info,
    client_bank_info,
    client_web_hooks,
    company,
    company_auth_info,
    employer,
    company_plugin,
    user,
    user_auth_info,
    user_payout,
    pay_summary,
    pay_item,
    pay_activity,
  ],

  // Set to true should only be used when initialize the database schemas
  // as it will delete existing columns which is dangerous on prod enviroment.
  synchronize: false,
};
