import { DataRequest } from './DataRequest';
import { HttpService } from '@nestjs/axios';
import { company_auth_info } from '../../../database/entities/';
import Shopify, { AuthQuery, ApiVersion } from '@shopify/shopify-api';
import {
  Balance,
  Payout,
  PaymentTransaction,
} from '@shopify/shopify-api/dist/rest-resources/2022-10/index.js';
import {
  DataResultAccountDto,
  DataResultApiDto,
  DataResultDto,
  DataResultValueDto,
} from '../dto/dataresult.dto';

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
    let dataResultDto = new DataResultDto('Shopify');
    let accountDto = new DataResultAccountDto(sessionData.shop, dataResultDto);

    try {
      result += '<h1>Balance API</h1><br/>';
      const balances = await Balance.all({
        session: sessionData,
      });
      let apiDto = new DataResultApiDto('Balance API', accountDto);
      if (Array.isArray(balances)) {
        for (const balance of balances) {
          new DataResultValueDto('shop', balance.session.shop, apiDto);
          new DataResultValueDto('amount', balance.amount, apiDto);
          new DataResultValueDto('currency', balance.currency, apiDto);
        }
      }
      result += '<pre>' + JSON.stringify(balances, null, 4) + '</pre><br/>';

      result += '<h1>Payout API</h1><br/>';
      const payouts = await Payout.all({
        session: sessionData,
        date_max: '2022-09-12',
      });
      apiDto = new DataResultApiDto('Payout API', accountDto);
      if (Array.isArray(payouts)) {
        for (const payout of payouts) {
          new DataResultValueDto('id', payout.id, apiDto);
          new DataResultValueDto('amount', payout.amount, apiDto);
          new DataResultValueDto('currency', payout.currency, apiDto);
          new DataResultValueDto('date', payout.date, apiDto);
        }
      }
      result += '<pre>' + JSON.stringify(payouts, null, 4) + '</pre><br/>';

      result += '<h1>PaymentTransaction API</h1><br/>';
      if (Array.isArray(payouts)) {
        for (const payout of payouts) {
          apiDto = new DataResultApiDto(
            'PaymentTransaction API of ' + payout.id,
            accountDto,
          );
          let transactions = await PaymentTransaction.transactions({
            session: sessionData,
            payout_id: payout.id,
          });
          if (Array.isArray(transactions)) {
            for (const transaction of transactions) {
              new DataResultValueDto('amount', transaction.amount, apiDto);
              new DataResultValueDto('currency', transaction.currency, apiDto);
              new DataResultValueDto(
                'processed_at',
                transaction.processed_at,
                apiDto,
              );
            }
          }
          result +=
            '<pre>' + JSON.stringify(transactions, null, 4) + '</pre><br/>';
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
