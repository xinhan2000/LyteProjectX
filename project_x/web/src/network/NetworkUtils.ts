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
      paramsSerializer: function handleQuery(query) {
        // if param is an array and defined like this: metrics=[a, b],
        // convert it like below:
        // metrics=a&metrics=b
        return Object.entries(query)
          .map(([key, value], i) =>
            Array.isArray(value)
              ? `${key}=${value.join('&' + key + '=')}`
              : `${key}=${value}`,
          )
          .join('&');
      },
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
        throw new Error(e);
      });
  }
}
