// models
import { DataPlatforms } from '../models/data.model.js';
// services
import { CoinGeckoDataService } from './coin-gecko.service.js';

export class DataBrokerService {
  private static readonly DATA_SERVICE_MAP: { [id: string]: any } = {
    [DataPlatforms.CoinGecko]: CoinGeckoDataService,
  };

  /**
   *
   * @param platformName
   * @returns
   */
  static getService(platformName: string): any {
    return new this.DATA_SERVICE_MAP[platformName]();
  }
}
