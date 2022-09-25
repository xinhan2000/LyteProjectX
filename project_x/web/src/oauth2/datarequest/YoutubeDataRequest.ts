import { DataRequest } from './DataRequest';
import { HttpService } from '@nestjs/axios';
import { google } from 'googleapis';

export class YoutubeDataRequest extends DataRequest {
  PARAM_INCLUDE_GRANTED_SCOPES = 'include_granted_scopes';

  oauth2Client = new google.auth.OAuth2(
    '678427232909-ortnnsd6e27q6ks51ejihljbh8scebif.apps.googleusercontent.com', // client_id
    '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', //client_secret
    'https://projectx.i234.me/oauth2/code/callback', //redirect_uri
  );

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
    const adsense = google.adsense('v2');

    let accounts = null;
    try {
      accounts = await adsense.accounts.list({
        pageSize: 10,
        access_token: accessToken,
      });
    } catch (e) {
      throw new Error(e);
    }
    let accountName = accounts.data.accounts[0].name;

    let paymentsResult = null;
    try {
      paymentsResult = await adsense.accounts.payments.list({
        parent: accountName,
        access_token: accessToken,
      });
    } catch (e) {
      throw new Error(e);
    }
    let result = '<html><body>';
    result += this.getPaymentsResult(paymentsResult.data.payments);

    let reportsResult = null;
    try {
      const reportsParams = {
        account: accountName,
        // startDate: { year: 2022, month: 9, day: 20 },
        // endDate: { year: 2022, month: 9, day: 20 },
        dateRange: 'YESTERDAY',
        access_token: accessToken,
        metrics: ['ESTIMATED_EARNINGS', 'TOTAL_EARNINGS', 'TOTAL_IMPRESSIONS'],
        dimensions: ['AD_UNIT_NAME'],
      };
      reportsResult = await adsense.accounts.reports.generate(reportsParams);
    } catch (e) {
      throw new Error(e);
    }
    result += this.getReportsResult(reportsResult.data);
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
