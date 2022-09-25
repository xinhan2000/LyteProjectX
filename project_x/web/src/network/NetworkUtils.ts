import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { firstValueFrom } from 'rxjs';

export class NetworkUtils {
  static async processNetworkRequest(
    httpService: HttpService,
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

    return firstValueFrom(httpService.request(requestConfig))
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((e) => {
        throw new Error('internal communication error');
      });
  }
}
