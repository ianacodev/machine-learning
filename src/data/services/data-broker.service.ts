import { Observable, interval } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
// services
import { CoinbaseDataService } from './coinbase-data.service.js';
// models
import {
  CryptoCurrency,
  DataPlatforms,
  CryptoPrice,
} from '../models/data.model.js';
// utilities
import { convertSecondsToMilliseconds } from '../../utilities/time.js';
export class DataBrokerService {
  private readonly DEFAULT_POLLING_INTERVAL_SECONDS = 30;
  private readonly DATA_SERVICE_MAP: { [id: string]: any } = {
    [DataPlatforms.Coinbase]: CoinbaseDataService,
  };
  private service: any;

  constructor(platformName: string) {
    this.service = new this.DATA_SERVICE_MAP[platformName]();
  }

  /**
   *
   * @param platformName
   * @returns
   */
  getService(): any {
    return this.service;
  }

  getCryptoPrice(cryptocurrency: CryptoCurrency): Observable<CryptoPrice> {
    return this.service.getCryptoPrice(cryptocurrency);
  }

  /**
   * poll crypto price
   * @param cryptocurrency
   * @param intervalSeconds
   * @returns observable of condensed market data
   */
  pollCryptoPrice(
    cryptocurrency: CryptoCurrency,
    intervalSeconds: number = 15,
  ): Observable<CryptoPrice> {
    const intervalMS = convertSecondsToMilliseconds(
      intervalSeconds || this.DEFAULT_POLLING_INTERVAL_SECONDS,
    );
    return interval(intervalMS).pipe(
      exhaustMap(() => this.getCryptoPrice(cryptocurrency)),
    );
  }
}
