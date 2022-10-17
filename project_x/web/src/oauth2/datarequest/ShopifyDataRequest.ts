import { DataRequest } from './DataRequest';
import { HttpService } from '@nestjs/axios';
import { company_auth_info } from '../../../database/entities/';
import Shopify, { AuthQuery, ApiVersion } from '@shopify/shopify-api';
import {
  Balance,
  Payout,
  PaymentTransaction,
} from '@shopify/shopify-api/dist/rest-resources/2022-10/index.js';

export class ShopifyDataRequest extends DataRequest {
  initialized = false;

  public override async generateAuthorizationCodeRedirectUrl(
    companyAuthInfo: company_auth_info,
    req: any,
    res: any,
  ): Promise<string> {
    if (!req.query.shop) {
      throw new Error('shop is not defined in the parameter');
    }

    this.maybeInitialize(companyAuthInfo);
    return await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      companyAuthInfo.redirect_url,
      false,
    );
  }

  public override async processAuthorizationCodeCallback(
    code: string,
    companyAuthInfo: company_auth_info,
    req: any,
    res: any,
    httpService: HttpService,
  ): Promise<any> {
    this.maybeInitialize(companyAuthInfo);
    try {
      const data = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query as unknown as AuthQuery, // req.query must be cast to unkown and then AuthQuery in order to be accepted
      );
      return data;
    } catch (e) {
      throw e;
    }
  }

  public override async requestData(
    sessionData: any,
    endpoint: string,
    req: any,
    res: any,
    httpService: HttpService,
  ): Promise<any> {
    let result = '<html><body>';

    try {
      result += '<h1>Balance API</h1><br/>';
      const balance = await Balance.all({
        session: sessionData,
      });
      result += JSON.stringify(balance) + '<br/>';

      result += '<h1>Payout API</h1><br/>';
      const payouts = await Payout.all({
        session: sessionData,
        date_max: '2022-09-12',
      });
      result += JSON.stringify(payouts) + '<br/>';

      result += '<h1>PaymentTransaction API</h1><br/>';
      if (Array.isArray(payouts)) {
        for (const payout of payouts) {
          let transaction = await PaymentTransaction.transactions({
            session: sessionData,
            payout_id: payout.id,
          });
          result += JSON.stringify(transaction) + '<br/>';
        }
      }
    } catch (e) {
      throw e;
    }

    result += '</body></html>';

    return result;
  }

  private maybeInitialize(companyAuthInfo: company_auth_info) {
    if (!this.initialized) {
      this.initialized = true;
      Shopify.Context.initialize({
        API_KEY: companyAuthInfo.client_id,
        API_SECRET_KEY: companyAuthInfo.client_secret,
        SCOPES: companyAuthInfo.scope.split(','),
        // TODO: change to production host name
        HOST_NAME: 'projectx.i234.me',
        HOST_SCHEME: 'HTTPS',
        IS_EMBEDDED_APP: false,
        API_VERSION: ApiVersion.October22,
      });
    }
  }
}
