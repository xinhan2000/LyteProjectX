/**
 * The class represents third party platform data pull model
 */

import { HttpService } from '@nestjs/axios';
import { NetworkUtils } from '../../network/NetworkUtils';
import { company_auth_info } from '../../../database/entities/';
import { DataRequestName, DataRequestByName } from './DataRequestByName';

const PARAM_CLIENT_ID = 'client_id';
const PARAM_REDIRECT_URI = 'redirect_uri';
const PARAM_RESPONE_TYPE = 'response_type';
const PARAM_SCOPE = 'scope';
const PARAM_STATE = 'state';

const GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
const GRANT_TYPE_PASSWORD = 'password';

export abstract class DataRequest {
  /**
   * Generate authorization code redirect url
   * @param companyAuthInfo company_auth_info data
   * @param req http request
   * @param res htt response
   */
  public async generateAuthorizationCodeRedirectUrl(
    companyAuthInfo: company_auth_info,
    req: any,
    res: any,
  ): Promise<string> {
    const redirectUrl = this.getRedirectUrl(companyAuthInfo.redirect_url);
    const responseType = 'code';
    const state = companyAuthInfo.name;

    const url = new URL(companyAuthInfo.auth_endpoint);

    url.searchParams.append(PARAM_CLIENT_ID, companyAuthInfo.client_id);
    url.searchParams.append(PARAM_REDIRECT_URI, redirectUrl);
    url.searchParams.append(PARAM_RESPONE_TYPE, responseType);
    url.searchParams.append(PARAM_SCOPE, companyAuthInfo.scope);

    url.searchParams.append(PARAM_STATE, state);

    const dataRequest = DataRequestByName.get(
      companyAuthInfo.name as DataRequestName,
    );
    dataRequest.appendAuthorizationCodeRedirectUrlParams(url.searchParams);

    return url.href;
  }

  /**
   * Process authorization code flow's callback
   * @param code code returned from the authorization code flow
   * @param companyAuthInfo company_auth_info data
   * @param req http request
   * @param res http response
   */
  public async processAuthorizationCodeCallback(
    code: string,
    companyAuthInfo: company_auth_info,
    req: any,
    res: any,
    httpService: HttpService,
  ): Promise<any> {
    const redirectUrl = this.getRedirectUrl(companyAuthInfo.redirect_url);
    const headers = {
      'Content-Type': 'application/json',
    };

    const params = {
      code: code,
      client_id: companyAuthInfo.client_id,
      client_secret: companyAuthInfo.client_secret,
      redirect_uri: redirectUrl,
      grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
    };

    const data = await NetworkUtils.processNetworkRequest(
      httpService,
      companyAuthInfo.token_endpoint,
      'post',
      headers,
      params,
    );

    return data;
  }

  /**
   * Append additional http params for authorization code redirect url if necessary
   * @param searchParams search params
   */
  protected appendAuthorizationCodeRedirectUrlParams(
    searchParams: URLSearchParams,
  ) {}

  /**
   * request data by calling third party api
   * @param sessionData authentication data returned from third party, including access_token in it.
   * @param endpoint data api's endpoint
   * @param req http request
   * @param res http response
   * @param httpService http service module
   */
  public async requestData(
    sessionData: any,
    endpoint: string,
    req: any,
    res: any,
    httpService: HttpService,
  ): Promise<any> {}

  private getRedirectUrl(redirectUrlPath: string): string {
    //TODO: read the production website address from environment
    return 'https://projectx.i234.me' + redirectUrlPath;
  }
}
