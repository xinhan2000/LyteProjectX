/**
 * The class represents third party platform data pull model
 */

// import { GoogleDataRequest } from './GoogleDataRequest';

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
   * @param endpoint data api's endpoint
   * @param accessToken access token
   */
  public requestData(endpoint: string, accessToken: string) {}
}
