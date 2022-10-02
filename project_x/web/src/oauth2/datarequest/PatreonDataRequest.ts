import { DataRequest } from './DataRequest';
import { HttpService } from '@nestjs/axios';
import { NetworkUtils } from '../../network/NetworkUtils';

export class PatreonDataRequest extends DataRequest {
  BASE_URI = 'https://www.patreon.com/api/oauth2/api/';
  PARAM_INCLUDE_GRANTED_SCOPES = 'include_granted_scopes';

  public override async requestData(
    httpService: HttpService,
    endpoint: string,
    accessToken: string,
  ) {
    // Acquire accounts information
    let data = null;
    try {
      data = await NetworkUtils.processNetworkRequest(
        httpService,
        this.BASE_URI + 'current_user',
        'get',
        null /* headers */,
        {
          access_token: accessToken,
        },
      );
    } catch (e) {
      throw new Error(e);
    }

    // Fetch campaigns information
    try {
      data = await NetworkUtils.processNetworkRequest(
        httpService,
        this.BASE_URI + 'current_user/campaigns',
        'get',
        null /* headers */,
        {
          access_token: accessToken,
          includes: 'pledges',
        },
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
