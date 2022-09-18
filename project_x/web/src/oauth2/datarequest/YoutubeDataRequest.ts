import { DataRequest } from './DataRequest';

export class YoutubeDataRequest extends DataRequest {
  PARAM_INCLUDE_GRANTED_SCOPES = 'include_granted_scopes';

  public override appendAuthorizationCodeRedirectUrlParams(
    searchParams: URLSearchParams,
  ) {
    searchParams.append(this.PARAM_INCLUDE_GRANTED_SCOPES, 'true');
  }
}
