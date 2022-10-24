import { DataRequest } from './DataRequest';
import { HttpService } from '@nestjs/axios';
import { NetworkUtils } from '../../network/NetworkUtils';
import {
  DataResultAccountDto,
  DataResultApiDto,
  DataResultDto,
  DataResultValueDto,
} from '../dto/dataresult.dto';
import { json } from 'stream/consumers';

export class YoutubeDataRequest extends DataRequest {
  BASE_URI = 'https://adsense.googleapis.com/v2/';

  PARAM_ACCESS_TYPE = 'access_type';
  PARAM_INCLUDE_GRANTED_SCOPES = 'include_granted_scopes';

  protected override appendAuthorizationCodeRedirectUrlParams(
    searchParams: URLSearchParams,
  ) {
    // Ask for returning refresh_token
    searchParams.append(this.PARAM_ACCESS_TYPE, 'offline');
    searchParams.append(this.PARAM_INCLUDE_GRANTED_SCOPES, 'true');
  }

  public override async requestData(
    sessionData: any,
    endpoint: string,
    req: any,
    res: any,
    httpService: HttpService,
  ): Promise<any> {
    // Acquire accounts information
    let accessToken = sessionData['access_token'];
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

    let result = '<html><body>';
    let dataResultDto = new DataResultDto('Youtube');

    if (Array.isArray(data.accounts)) {
      for (const account of data.accounts) {
        let accountName = account.name;
        let accountDto = new DataResultAccountDto(accountName, dataResultDto);

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
        result += this.getPaymentsResult(data.payments, accountDto);

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
          result += this.getReportsResult(data, accountDto);
        } catch (e) {
          throw new Error(e);
        }
      }
    }

    result += '</body></html>';

    return result;
    // return JSON.stringify(dataResultDto, null, 4);
  }

  getPaymentsResult(payments, accountDto: DataResultAccountDto) {
    let apiDto = new DataResultApiDto('Payments API', accountDto);

    let result = '<h1>Payments API</h1><br/>';
    if (!Array.isArray(payments)) return result;

    payments.forEach((it) => {
      if (it.date) {
        result += 'On ' + it.date + ' you have ';
        new DataResultValueDto('date', it.date, apiDto);
      }
      if (it.name) {
        let lastIndex = it.name.lastIndexOf('/');
        if (lastIndex != -1) {
          let name = it.name.substring(lastIndex + 1);
          result += name + ' ';
          new DataResultValueDto('name', name, apiDto);
        }
      }
      if (it.amount) {
        result += 'amount ' + it.amount;
        new DataResultValueDto('amount', it.amount, apiDto);
      }
      result += '<br/>';
    });
    return result;
  }

  getReportsResult(reports, accountDto: DataResultAccountDto) {
    let apiDto = new DataResultApiDto('Reports API', accountDto);

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
      new DataResultValueDto('startDate', date, apiDto);
    }
    date = reports.endDate;
    if (date) {
      result +=
        'End date: ' + date.year + '-' + date.month + '-' + date.day + '<br/>';
      new DataResultValueDto('endDate', date, apiDto);
    }

    result +=
      'totalMatchedRows: ' +
      (totalMatchedRows ? totalMatchedRows : 0) +
      '<br/>';
    new DataResultValueDto(
      'totalMatchedRows',
      totalMatchedRows ? totalMatchedRows : 0,
      apiDto,
    );
    result += 'totals: ' + (reports.totals ? reports.totals : 0) + '<br/>';
    new DataResultValueDto(
      'totals',
      reports.totals ? reports.totals : 0,
      apiDto,
    );
    result +=
      'averages: ' + (reports.averages ? reports.averages : 0) + '<br/>';
    new DataResultValueDto(
      'averages',
      reports.averages ? reports.averages : 0,
      apiDto,
    );
    result += 'rows: ' + (rows ? rows : 0) + '<br/>';
    new DataResultValueDto('rows', rows ? rows : 0, apiDto);

    const currency = reports.headers.find(
      (x) => x.name === 'ESTIMATED_EARNINGS',
    ).currencyCode;
    for (let i = 0; i < totalMatchedRows; i += 1) {
      // Verify in the future
      const name = rows[i][0].split('_')[0];
      const earnings = rows[i][1];
      result += `\n${name}: ${earnings}${currency}`;
      result += '<br/>';
      new DataResultValueDto('name', `${name}: ${earnings}${currency}`, apiDto);
    }
    return result;
  }
}
