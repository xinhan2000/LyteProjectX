import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { firstValueFrom } from 'rxjs';
import { URL } from 'url';

@Injectable()
export class Oauth2Service {
  PARAM_CLIENT_ID = 'client_id';
  PARAM_CLIENT_SECRET = 'client_secret';
  PARAM_REDIRECT_URI = 'redirect_uri';
  PARAM_RESPONE_TYPE = 'response_type';
  PARAM_SCOPE = 'scope';
  PARAM_ACCESS_TYPE = 'access_type';
  PARAM_STATE = 'state';
  PARAM_INCLUDE_GRANTED_SCOPES = 'include_granted_scopes';
  PARAM_GRANT_TYPE = 'grant_type';
  PARAM_CODE = 'code';

  GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
  GRANT_TYPE_PASSWORD = 'password';

  constructor(private readonly httpService: HttpService) {}

  generateAuthorizationCodeRedirectUrl(): string {
    // Google client
    const clientId =
      '678427232909-ortnnsd6e27q6ks51ejihljbh8scebif.apps.googleusercontent.com';
    const redirectUri = 'https://projectx.i234.me/oauth2/code/callback';
    const responseType = 'code';
    const scope = 'https://www.googleapis.com/auth/youtube.readonly';
    const accessType = 'offline';
    const state = 'test_state';
    const includeGrantedScopes = 'true';

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    url.searchParams.append(this.PARAM_CLIENT_ID, clientId);
    url.searchParams.append(this.PARAM_REDIRECT_URI, redirectUri);
    url.searchParams.append(this.PARAM_RESPONE_TYPE, responseType);
    url.searchParams.append(this.PARAM_SCOPE, scope);
    url.searchParams.append(this.PARAM_ACCESS_TYPE, accessType);
    url.searchParams.append(this.PARAM_STATE, state);
    url.searchParams.append(
      this.PARAM_INCLUDE_GRANTED_SCOPES,
      includeGrantedScopes,
    );

    console.log(url.href);

    return url.href;
  }

  async processAuthorizationCodeCallback(
    code: string,
    state: string,
    error: string,
  ) {
    if (error != null) {
      return error;
    }

    // Google client
    const clientId =
      '678427232909-ortnnsd6e27q6ks51ejihljbh8scebif.apps.googleusercontent.com';
    const clientSecret = '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';
    const redirectUrl = 'https://projectx.i234.me/oauth2/code/callback';

    const headers = {
      'Content-Type': 'application/json',
    };
    const params = {
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
      grant_type: this.GRANT_TYPE_AUTHORIZATION_CODE,
    };
    return this.processNetworkRequest(
      'https://oauth2.googleapis.com/token',
      'post',
      headers,
      params,
    );
  }

  async handleAuthorizationPasswordToken() {
    // Patreon client
    const clientId =
      'YfnyzVWdaWyUPpaCmzcYTQfKFZtVrY6VY0NU0TT6O1ULezVBX-5cd_qQ0fklKhOX';
    const clientSecret =
      'hk7ZivBJ-gejeGWQzDTeDfoGpAkSxcZYqVLhqlIVt0Vd2SVbED-pSXG7fsWTzBLR';
    const scope = 'users pledges-to-me my-campaign';
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

    return this.processNetworkRequest(
      'https://www.patreon.com/api/oauth2/token',
      'post',
      headers,
      params,
    );
  }

  async processNetworkRequest(
    baseUrl: string,
    httpMethod: string,
    headers?: AxiosRequestHeaders,
    params?: any,
  ): Promise<any> {
    const requestConfig: AxiosRequestConfig = {
      baseURL: baseUrl,
      method: httpMethod,
      headers: headers,
      params: params,
      validateStatus: function (status: number) {
        return status === 200;
      },
    };

    return firstValueFrom(this.httpService.request(requestConfig))
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((e) => {
        throw new Error('internal communication error');
      });
  }
}
