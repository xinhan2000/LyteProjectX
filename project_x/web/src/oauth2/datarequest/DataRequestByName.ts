import { DataRequest } from './DataRequest';
import { YoutubeDataRequest } from './YoutubeDataRequest';

export enum DataRequestName {
  YOUTUBE = 'youtube',
  PATREON = 'patreon',
  SHOPIFY = 'shopify',
}

/**
 * Return data request instance by name
 */
export class DataRequestByName {
  /**
   * Get data request instance
   * @param dataRequestName DataRequestName enum
   * @returns
   */
  public static get(dataRequestName: DataRequestName): DataRequest {
    switch (dataRequestName) {
      case DataRequestName.YOUTUBE:
        return new YoutubeDataRequest();
      default:
        throw new Error(`Class type for \'${dataRequestName}\' is not defined`);
    }
  }
}
