// models
import {
  CryptoCurrenciesCoins,
  CryptoCurrencies,
} from '../models/data.model.js';

export const cryptocurrencies: CryptoCurrencies = {
  [CryptoCurrenciesCoins.Cardano]: {
    id: CryptoCurrenciesCoins.Cardano,
    symbol: 'ada',
  },
};
