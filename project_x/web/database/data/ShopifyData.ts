import { AbstractData } from './AbstractData';
import { DataSource } from 'typeorm';

import {
  company,
  CompanyType,
  company_auth_info,
  PluginType,
} from '../entities';

export class ShopifyData implements AbstractData {
  async prepareData(dataSource: DataSource) {
    try {
      console.log('Preparing Shopify data ...');
      await dataSource.transaction(async (manager) => {
        let auth = new company_auth_info();
        let name = 'shopify';
        auth.name = name;
        auth.auth_endpoint = '/admin/oauth/authorize';
        auth.token_endpoint = '/admin/oauth/access_token';
        auth.redirect_url = '/oauth2/code/callback';
        auth.scope = 'read_payment_terms,read_shopify_payments_payouts';
        //TODO: change to real values
        auth.client_id = 'e4a04548696b828ddbcc4a4aa7fc7f73';
        auth.client_secret = '4d55a3ad58a418d80d58b679f9b334f7';

        const companyAuthInfoRepository =
          manager.getRepository(company_auth_info);
        await companyAuthInfoRepository.upsert([auth], ['name']);

        let shopify: company = new company();
        shopify.name = name;
        shopify.type = CompanyType.GIG;
        shopify.default_plugin_type = PluginType.OAUTH2;
        shopify.auth = auth;

        const companyRepository = manager.getRepository(company);
        await companyRepository.upsert([shopify], ['name']);
      });
    } catch (e) {
      console.log('Upsert shopify: ' + e);
    }
  }
}
