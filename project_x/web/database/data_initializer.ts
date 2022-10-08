import { DataSource } from 'typeorm';
import { PatreonData } from './data/PatreonData';
import { YoutubeData } from './data/YoutubeData';
import {
  client,
  client_auth_info,
  client_bank_info,
  client_web_hooks,
  company,
  CompanyType,
  company_auth_info,
  GrantType,
  employer,
  company_plugin,
  PluginType,
  user,
  user_auth_info,
  user_payout,
  pay_summary,
  pay_item,
  pay_activity,
} from './entities';

export class DataInitializer {
  dataSource = new DataSource({
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
  });

  public async prepareData() {
    try {
      console.log('Preparing data ...');
      await this.dataSource.initialize();

      await this.prepareCompanyData();
    } catch (e) {
      console.log('error to prepare data');
      throw new Error(e);
    } finally {
      await this.dataSource.destroy();
      console.log('Preparing data done.');
    }
  }

  async prepareCompanyData() {
    await new YoutubeData().prepareData(this.dataSource);
    await new PatreonData().prepareData(this.dataSource);
  }
}

new DataInitializer().prepareData();
