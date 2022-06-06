import { Axios } from 'axios-observable';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
// models
import {
  CryptoCurrency,
  CryptoCurrencyCoins,
  CryptoPrice,
  BaseService,
} from '../../data/models/data.model.js';
import { CoinbaseSpotPrice } from '../models/coinbase.model.js';

export class CoinbaseDataService implements BaseService {
  readonly baseUrl = 'https://api.coinbase.com/v2';
  readonly coinbaseMap: { [key: string]: string } = {
    [CryptoCurrencyCoins.Bitcoin]: 'BTC-USD',
  };

  /**
   * get crypto price
   * @param cryptoCurrency
   * @returns
   */
  getCryptoPrice(cryptocurrency: CryptoCurrency): Observable<CryptoPrice> {
    const coinbaseCoinId = this.coinbaseMap[cryptocurrency.name];
    const url = `${this.baseUrl}/prices/${coinbaseCoinId}/spot`;
    return Axios.get(url).pipe(
      map(({ data }) => ({
        name: cryptocurrency.name,
        amount: data.data.amount,
      })),
      catchError((err) => throwError(() => new Error(err))),
    );
  }
}
