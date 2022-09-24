/**
 * The class represents third party platform data pull model
 */

import { HttpService } from '@nestjs/axios';

export abstract class DataRequest {
  /**
   * Append additional http params for authorization code redirect url if necessary
   * @param searchParams search params
   */
  public appendAuthorizationCodeRedirectUrlParams(
    searchParams: URLSearchParams,
  ) {}

  /**
   * request data by calling third party api
   * @param httpService http service module
   * @param endpoint data api's endpoint
   * @param accessToken access token
   */
  public requestData(
    httpService: HttpService,
    endpoint: string,
    accessToken: string,
  ) {}
}
