import CoinGecko from 'coingecko-api';
import { Observable, interval, from, catchError, throwError } from 'rxjs';
import { exhaustMap, pluck, map } from 'rxjs/operators';
// models
import { CryptoCurrency } from '../../shared/models/cryptocurrency.model.js';
// configs
import { coinGeckoConfig } from '../configs/coin-gecko.config.js';
import {
  DEFAULT_POLLING_INTERVAL_SECONDS,
  DEFAULT_CURRENCY,
  DATA_SCALE,
} from '../configs/data-settings.config.js';
// utilities
import {
  convertSecondsToMilliseconds,
  getTodaysDate,
} from '../../utilities/time.js';

export class CoinGeckoDataService {
  coinGeckoClient: CoinGecko;

  constructor() {
    this.coinGeckoClient = new CoinGecko();
  }

  /**
   *
   * @param cryptocurrency
   * @param data dd-mm-yyyy
   */
  getHistoricalMarketData(
    cryptocurrency: CryptoCurrency,
    date: string = getTodaysDate(),
  ): any {
    const config = { ...coinGeckoConfig.apiHistorySettings, date };
    return from(
      this.coinGeckoClient.coins.fetchHistory(cryptocurrency.id, config),
    ).pipe(catchError((error) => throwError(() => new Error(error))));
  }

  /**
   * get market data
   * @param id
   */
  getMarketData(cryptocurrency: CryptoCurrency): Observable<any> {
    return from(
      this.coinGeckoClient.coins.fetch(
        cryptocurrency.id,
        coinGeckoConfig.apiFetchSettings,
      ),
    ).pipe(
      pluck('data', 'market_data'),
      catchError((error) => throwError(() => new Error(error))),
    );
  }

  /**
   *
   * @param cryptocurrency
   * @param intervalSeconds
   * @returns observable of condensed market data
   */
  pollCondensedMarketData(
    cryptocurrency: { id: string; symbol: string },
    intervalSeconds: number = 10,
  ): Observable<any> {
    const intervalMS = convertSecondsToMilliseconds(
      intervalSeconds || DEFAULT_POLLING_INTERVAL_SECONDS,
    );
    return interval(intervalMS).pipe(
      exhaustMap(() => this.getMarketData(cryptocurrency)),
      map((marketData) => this.filterCurrency(marketData)),
    );
  }

  /**
   *
   * @param marketData
   * @returns
   */
  filterCurrency(marketData: any, currency: string = DEFAULT_CURRENCY): any {
    const { current_price, ath, atl, total_volume, high_24h, low_24h } =
      marketData;
    return {
      current_price: current_price[currency] / DATA_SCALE,
      ath: ath[currency],
      atl: atl[currency],
      total_volume: total_volume[currency],
      high_24h: high_24h[currency],
      low_24h: low_24h[currency],
    };
  }
}
