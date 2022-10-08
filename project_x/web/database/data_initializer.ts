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
      console.log('Preparing data ...');
      await this.mysqlDataSource.initialize();

      await this.prepareCompanyData();
    } catch (e) {
      console.log('error to prepare data');
      throw new Error(e);
    } finally {
      await this.mysqlDataSource.destroy();
      console.log('Preparing data done.');
    }
  }

  async prepareCompanyData() {
    try {
      console.log('Preparing Youtube data ...');
      await this.mysqlDataSource.transaction(async (manager) => {
        let auth = new company_auth_info();
        let name = 'youtube';
        auth.name = name;
        auth.auth_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
        auth.token_endpoint = 'https://oauth2.googleapis.com/token';
        auth.redirect_url = '/oauth2/code/callback';
        auth.grant_type = GrantType.AUTHORIZATION_CODE;
        auth.scope = 'https://www.googleapis.com/auth/adsense';
        // //TODO: change to real values
        auth.client_id =
          '678427232909-ortnnsd6e27q6ks51ejihljbh8scebif.apps.googleusercontent.com';
        auth.client_secret = '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';

        const companyAuthInfoRepository =
          manager.getRepository(company_auth_info);
        await companyAuthInfoRepository.upsert([auth], ['name']);

        let youtube: company = new company();
        youtube.name = name;
        youtube.type = CompanyType.GIG;
        youtube.default_plugin_type = PluginType.OAUTH2;
        youtube.auth = auth;

        const companyRepository = manager.getRepository(company);
        await companyRepository.upsert([youtube], ['name']);
      });
    } catch (e) {
      console.log('Upsert youtube: ' + e);
    }
  }
}

new DataInitializer().prepareData();
