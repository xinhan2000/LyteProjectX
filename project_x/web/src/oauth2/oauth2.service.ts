import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DataSource } from 'typeorm';
import { URL } from 'url';
import { NetworkUtils } from '../network/NetworkUtils';
import { company_auth_info } from '../../database/entities/';

import {
  DataRequestName,
  DataRequestByName,
} from './datarequest/DataRequestByName';

@Injectable()
export class Oauth2Service {
  PARAM_CLIENT_ID = 'client_id';
  PARAM_CLIENT_SECRET = 'client_secret';
  PARAM_REDIRECT_URI = 'redirect_uri';
  PARAM_RESPONE_TYPE = 'response_type';
  PARAM_SCOPE = 'scope';
  PARAM_ACCESS_TYPE = 'access_type';
  PARAM_STATE = 'state';
  PARAM_GRANT_TYPE = 'grant_type';
  PARAM_CODE = 'code';

  GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
  GRANT_TYPE_PASSWORD = 'password';

  constructor(
    private readonly httpService: HttpService,
    private dataSource: DataSource,
  ) {}

  async generateAuthorizationCodeRedirectUrl(company: string): Promise<string> {
    if (!company) {
      throw Error('company name is empty');
    }

    const companyAuthInfoRepository =
      this.dataSource.getRepository(company_auth_info);
    const companyAuthInfo = await companyAuthInfoRepository.findOneBy({
      name: company,
    });
    if (!companyAuthInfo) {
      throw Error('Company auth info not existed');
    }

    const redirectUrl = this.getRedirectUrl(companyAuthInfo.redirect_url);
    const responseType = 'code';
    const state = company;

    const url = new URL(companyAuthInfo.auth_endpoint);

    url.searchParams.append(this.PARAM_CLIENT_ID, companyAuthInfo.client_id);
    url.searchParams.append(this.PARAM_REDIRECT_URI, redirectUrl);
    url.searchParams.append(this.PARAM_RESPONE_TYPE, responseType);
    url.searchParams.append(this.PARAM_SCOPE, companyAuthInfo.scope);

    url.searchParams.append(this.PARAM_STATE, state);

    const dataRequest = DataRequestByName.get(company as DataRequestName);
    dataRequest.appendAuthorizationCodeRedirectUrlParams(url.searchParams);

    return url.href;
  }

  async processAuthorizationCodeCallback(
    code: string,
    state: string,
    error: string,
  ): Promise<string> {
    if (error != null) {
      return error;
    }

    //TODO: add safety check here, which we can pass the info in state
    let company = state;
    if (!company) {
      throw Error('company name is empty');
    }

    const companyAuthInfoRepository =
      this.dataSource.getRepository(company_auth_info);
    const companyAuthInfo = await companyAuthInfoRepository.findOneBy({
      name: company,
    });
    if (!companyAuthInfo) {
      throw Error('Company auth info not existed');
    }

    const redirectUrl = this.getRedirectUrl(companyAuthInfo.redirect_url);
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = {
      code: code,
      client_id: companyAuthInfo.client_id,
      client_secret: companyAuthInfo.client_secret,
      redirect_uri: redirectUrl,
      grant_type: this.GRANT_TYPE_AUTHORIZATION_CODE,
    };

    const data = await NetworkUtils.processNetworkRequest(
      this.httpService,
      companyAuthInfo.token_endpoint,
      'post',
      headers,
      params,
    );

    const dataRequest = DataRequestByName.get(company as DataRequestName);
    return await dataRequest.requestData(
      this.httpService,
      '',
      data['access_token'],
    );
  }

  async handleAuthorizationPasswordToken() {
    // Patreon client
    const clientId =
      'YfnyzVWdaWyUPpaCmzcYTQfKFZtVrY6VY0NU0TT6O1ULezVBX-5cd_qQ0fklKhOX';
    const clientSecret =
      'hk7ZivBJ-gejeGWQzDTeDfoGpAkSxcZYqVLhqlIVt0Vd2SVbED-pSXG7fsWTzBLR';
    const scope =
      'identity identity[email] identity.memberships campaigns campaigns.members campaigns.members[email] campaigns.members.address';
    const grantType = this.GRANT_TYPE_PASSWORD;
    const userName = 'xxxx';
    const password = 'xxxx';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const params = {
      grant_type: grantType,
      client_id: clientId,
      client_secret: clientSecret,
      scope: scope,
      username: userName,
      password: password,
    };

    var data = await NetworkUtils.processNetworkRequest(
      this.httpService,
      'https://www.patreon.com/api/oauth2/token',
      'post',
      headers,
      params,
    );

    const dataRequest = DataRequestByName.get(DataRequestName.PATREON);
    return await dataRequest.requestData(
      this.httpService,
      '',
      data['access_token'],
    );
  }

  getRedirectUrl(redirectUrlPath: string): string {
    //TODO: read the production website address from environment
    return 'https://projectx.i234.me' + redirectUrlPath;
  }
}
