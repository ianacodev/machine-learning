// models
import { CryptoCurrencyCoins, CryptoCurrencies } from '../models/data.model.js';

export const cryptocurrencies: CryptoCurrencies = {
  [CryptoCurrencyCoins.Control]: {
    name: CryptoCurrencyCoins.Control,
    symbol: 'NaN',
    normalize: 10,
  },
  [CryptoCurrencyCoins.Bitcoin]: {
    name: CryptoCurrencyCoins.Bitcoin,
    symbol: 'btc',
    normalize: 100000,
  },
  [CryptoCurrencyCoins.Cardano]: {
    name: CryptoCurrencyCoins.Cardano,
    symbol: 'ada',
    normalize: 1,
  },
};
