import { DataRequest } from './DataRequest';
import { YoutubeDataRequest } from './YoutubeDataRequest';
import { PatreonDataRequest } from './PatreonDataRequest';
import { ShopifyDataRequest } from './ShopifyDataRequest';

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
  static patreonDataRequest: PatreonDataRequest = null;
  static shopifyDataRequest: ShopifyDataRequest = null;

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
      case DataRequestName.PATREON:
        if (DataRequestByName.patreonDataRequest == null) {
          DataRequestByName.patreonDataRequest = new PatreonDataRequest();
        }
        return DataRequestByName.patreonDataRequest;
      case DataRequestName.SHOPIFY:
        if (DataRequestByName.shopifyDataRequest == null) {
          DataRequestByName.shopifyDataRequest = new ShopifyDataRequest();
        }
        return DataRequestByName.shopifyDataRequest;
      default:
        throw new Error(`Class type for \'${dataRequestName}\' is not defined`);
    }
  }
}
