import { DataSource } from 'typeorm';
import {
  client,
  client_auth_info,
  client_bank_info,
  client_web_hooks,
  company,
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
} from '../database/entities';
import { CompanyType } from './entities/company';

export class DataInitializer {
  mysqlDataSource = new DataSource({
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
      await this.mysqlDataSource.initialize();

      await this.prepareCompanyData();

      await this.mysqlDataSource.destroy();
    } catch (e) {
      throw new Error(e);
    }
  }

  async prepareCompanyData() {
    let youtube: company = new company();
    youtube.name = 'youtube';
    youtube.type = CompanyType.GIG;
    youtube.default_plugin_type = PluginType.OAUTH2;
    youtube.auth = new company_auth_info();
    youtube.auth.auth_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    youtube.auth.token_endpoint = 'https://oauth2.googleapis.com/token';
    youtube.auth.redirect_url = '/oauth2/code/callback';
    youtube.auth.grant_type = GrantType.AUTHORIZATION_CODE;
    youtube.auth.scope = 'https://www.googleapis.com/auth/adsense';

    //TODO: change to real values
    youtube.auth.client_id =
      '678427232909-ortnnsd6e27q6ks51ejihljbh8scebif.apps.googleusercontent.com';
    youtube.auth.client_secret = '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';

    await this.mysqlDataSource.manager.save(youtube);
  }
}

new DataInitializer().prepareData();
