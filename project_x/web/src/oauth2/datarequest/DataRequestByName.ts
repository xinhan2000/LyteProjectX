import { DataRequest } from './DataRequest';
import { GoogleDataRequest } from './GoogleDataRequest';

export enum DataRequestName {
  GOOGLE = 'google',
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
      case DataRequestName.GOOGLE:
        return new GoogleDataRequest();
      default:
        throw new Error(`Class type for \'${dataRequestName}\' is not defined`);
    }
  }
}
