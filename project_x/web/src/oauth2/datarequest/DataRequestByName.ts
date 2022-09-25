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
  static youtubeDataRequest: YoutubeDataRequest = null;

  /**
   * Get data request instance
   * @param dataRequestName DataRequestName enum
   * @returns
   */
  public static get(dataRequestName: DataRequestName): DataRequest {
    switch (dataRequestName) {
      case DataRequestName.YOUTUBE:
        if (DataRequestByName.youtubeDataRequest == null) {
          DataRequestByName.youtubeDataRequest = new YoutubeDataRequest();
        }
        return DataRequestByName.youtubeDataRequest;
      default:
        throw new Error(`Class type for \'${dataRequestName}\' is not defined`);
    }
  }
}
