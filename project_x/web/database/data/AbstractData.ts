/**
 * The class defines the behavior to prepare data in database
 */
import { DataSource } from 'typeorm';

export interface AbstractData {
  /**
   *
   * @param dataSource
   */
  prepareData(dataSource: DataSource);
}
