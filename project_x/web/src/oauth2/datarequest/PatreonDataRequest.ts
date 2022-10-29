import { DataRequest } from './DataRequest';
import { HttpService } from '@nestjs/axios';
import { NetworkUtils } from '../../network/NetworkUtils';

export class PatreonDataRequest extends DataRequest {
  BASE_URI = 'https://www.patreon.com/api/oauth2/v2/';

  FIELD_USER =
    'about,can_see_nsfw,created,email,first_name,full_name,hide_pledges,image_url,is_email_verified,' +
    'last_name,like_count,social_connections,thumb_url,url,vanity';
  FIELD_CAMPAIGN =
    'created_at,creation_name,discord_server_id,google_analytics_id,has_rss,has_sent_rss_notify,' +
    'image_small_url,image_url,is_charged_immediately,is_monthly,is_nsfw,main_video_embed,main_video_url,' +
    'one_liner,patron_count,pay_per_name,pledge_url,published_at,rss_artwork_url,rss_feed_title,show_earnings,' +
    'summary,thanks_embed,thanks_msg,thanks_video_url,url,vanity';

  public override async requestData(
    sessionData: any,
    endpoint: string,
    req: any,
    res: any,
    httpService: HttpService,
  ): Promise<any> {
    let accessToken = sessionData['access_token'];

    const headers = {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/vnd.api+json',
    };

    // Acquire accounts information
    let data = null;
    try {
      data = await NetworkUtils.processNetworkRequest(
        httpService,
        this.BASE_URI + 'identity',
        'get',
        headers,
        {
          include: 'memberships,campaign',
          'fields[user]': this.FIELD_USER,
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    let result =
      '<html><body><form style="width: 50%;margin: 0 auto;" action="/"><input type="submit" value="Home" /></form>';
    result += '<h1>Identity API</h1><br/>';
    result += '<pre>' + JSON.stringify(data.data, null, 4) + '</pre>';

    // Fetch campaigns information
    try {
      data = await NetworkUtils.processNetworkRequest(
        httpService,
        this.BASE_URI + 'campaigns',
        'get',
        headers,
        {
          include: 'tiers,creator,benefits,goals',
          'fields[campaign]': this.FIELD_CAMPAIGN,
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    result += '<h1>Campaigns API</h1><br/>';
    result += '<pre>' + JSON.stringify(data.data, null, 4) + '</pre>';
    result += '</body></html>';

    return result;
  }
}
