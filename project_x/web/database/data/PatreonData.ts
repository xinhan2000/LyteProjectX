import { AbstractData } from './AbstractData';
import { DataSource } from 'typeorm';

import {
  company,
  CompanyType,
  company_auth_info,
  PluginType,
} from '../entities';

export class PatreonData implements AbstractData {
  async prepareData(dataSource: DataSource) {
    try {
      console.log('Preparing Patreon data ...');
      await dataSource.transaction(async (manager) => {
        let auth = new company_auth_info();
        let name = 'patreon';
        auth.name = name;
        auth.auth_endpoint = 'https://www.patreon.com/oauth2/authorize';
        auth.token_endpoint = 'https://www.patreon.com/api/oauth2/token';
        auth.redirect_url = '/oauth2/code/callback';
        auth.scope =
          'identity identity[email] identity.memberships campaigns campaigns.members campaigns.members[email] campaigns.members.address';
        //TODO: change to real values
        auth.client_id =
          'YfnyzVWdaWyUPpaCmzcYTQfKFZtVrY6VY0NU0TT6O1ULezVBX-5cd_qQ0fklKhOX';
        auth.client_secret =
          'hk7ZivBJ-gejeGWQzDTeDfoGpAkSxcZYqVLhqlIVt0Vd2SVbED-pSXG7fsWTzBLR';

        const companyAuthInfoRepository =
          manager.getRepository(company_auth_info);
        await companyAuthInfoRepository.upsert([auth], ['name']);

        let patreon: company = new company();
        patreon.name = name;
        patreon.type = CompanyType.GIG;
        patreon.default_plugin_type = PluginType.OAUTH2;
        patreon.auth = auth;

        const companyRepository = manager.getRepository(company);
        await companyRepository.upsert([patreon], ['name']);
      });
    } catch (e) {
      console.log('Upsert Patreon: ' + e);
    }
  }
}
