import { AbstractData } from './AbstractData';
import { DataSource } from 'typeorm';

import {
  company,
  CompanyType,
  company_auth_info,
  PluginType,
} from '../entities';

export class YoutubeData implements AbstractData {
  async prepareData(dataSource: DataSource) {
    try {
      console.log('Preparing Youtube data ...');
      await dataSource.transaction(async (manager) => {
        let auth = new company_auth_info();
        let name = 'youtube';
        auth.name = name;
        auth.auth_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
        auth.token_endpoint = 'https://oauth2.googleapis.com/token';
        auth.redirect_url = '/oauth2/code/callback';
        auth.scope = 'https://www.googleapis.com/auth/adsense';
        //TODO: change to real values
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
