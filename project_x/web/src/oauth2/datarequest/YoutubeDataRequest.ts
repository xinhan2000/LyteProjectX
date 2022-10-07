import { DataRequest } from './DataRequest';
import { HttpService } from '@nestjs/axios';
import { NetworkUtils } from '../../network/NetworkUtils';

export class YoutubeDataRequest extends DataRequest {
  BASE_URI = 'https://adsense.googleapis.com/v2/';
  PARAM_INCLUDE_GRANTED_SCOPES = 'include_granted_scopes';

  public override appendAuthorizationCodeRedirectUrlParams(
    searchParams: URLSearchParams,
  ) {
    searchParams.append(this.PARAM_INCLUDE_GRANTED_SCOPES, 'true');
  }

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
        this.BASE_URI + 'accounts',
        'get',
        null /* headers */,
        {
          pageSize: 10,
          access_token: accessToken,
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    if (!data.accounts.length) return 'Not account available';
    // Return first account's data
    let accountName = data.accounts[0].name;

    // Acquire payments information
    try {
      data = await NetworkUtils.processNetworkRequest(
        httpService,
        this.BASE_URI + accountName + '/payments',
        'get',
        null /* headers */,
        {
          parent: accountName,
          access_token: accessToken,
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    let result = '<html><body>';
    result += this.getPaymentsResult(data.payments);

    // Acquire reports information
    try {
      data = await NetworkUtils.processNetworkRequest(
        httpService,
        this.BASE_URI + accountName + '/reports:generate',
        'get',
        null /* headers */,
        {
          'startDate.year': 2022,
          'startDate.month': 9,
          'startDate.day': 1,
          'endDate.year': 2022,
          'endDate.month': 9,
          'endDate.day': 2,
          dateRange: 'CUSTOM',
          // dateRange: 'YESTERDAY',
          access_token: accessToken,
          metrics: [
            'ESTIMATED_EARNINGS',
            'TOTAL_EARNINGS',
            'TOTAL_IMPRESSIONS',
          ],
          dimensions: ['AD_UNIT_NAME'],
        },
      );
    } catch (e) {
      throw new Error(e);
    }

    result += this.getReportsResult(data);
    result += '</body></html>';

    return result;
  }

  getPaymentsResult(payments) {
    let result = '<h1>Payments API</h1><br/>';
    if (!Array.isArray(payments)) return result;

    payments.forEach((it) => {
      if (it.date) {
        result += 'On ' + it.date + ' you have ';
      }
      if (it.name) {
        let lastIndex = it.name.lastIndexOf('/');
        if (lastIndex != -1) {
          let name = it.name.substring(lastIndex + 1);
          result += name + ' ';
        }
      }
      if (it.amount) {
        result += 'amount ' + it.amount;
      }
      result += '<br/>';
    });
    return result;
  }

  getReportsResult(reports) {
    const totalMatchedRows = reports.totalMatchedRows;
    const rows = reports.rows;

    let result = '<br/><h1>Reports API</h1><br/>';
    result +=
      'warnings: ' + (reports.warnings ? reports.warnings : 0) + '<br/><br/>';

    let date = reports.startDate;
    if (date) {
      result +=
        'Start date: ' +
        date.year +
        '-' +
        date.month +
        '-' +
        date.day +
        '<br/>';
    }
    date = reports.endDate;
    if (date) {
      result +=
        'End date: ' + date.year + '-' + date.month + '-' + date.day + '<br/>';
    }

    result +=
      'totalMatchedRows: ' +
      (totalMatchedRows ? totalMatchedRows : 0) +
      '<br/>';
    result += 'totals: ' + (reports.totals ? reports.totals : 0) + '<br/>';
    result +=
      'averages: ' + (reports.averages ? reports.averages : 0) + '<br/>';
    result += 'rows: ' + (rows ? rows : 0) + '<br/>';

    const currency = reports.headers.find(
      (x) => x.name === 'ESTIMATED_EARNINGS',
    ).currencyCode;
    for (let i = 0; i < totalMatchedRows; i += 1) {
      // Verify in the future
      const name = rows[i][0].split('_')[0];
      const earnings = rows[i][1];
      result += `\n${name}: ${earnings}${currency}`;
      result += '<br/>';
    }
    return result;
  }
}
