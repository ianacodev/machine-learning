export enum DataPlatforms {
  Coinbase = 'Coinbase',
}

export enum CryptoCurrencyCoins {
  Bitcoin = 'bitcoin',
  Cardano = 'cardano',
}

export interface CryptoCurrency {
  name: string;
  symbol: string;
  normalize: number;
}

export interface CryptoCurrencies {
  [id: string]: CryptoCurrency;
}

export interface CryptoPrice {
  name: string;
  amount: string;
}

export interface BaseService {
  getCryptoPrice: any;
}
