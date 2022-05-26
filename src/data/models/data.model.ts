export interface CondensedMarketData {
  current_price: number;
  ath: number;
  atl: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

export enum DataPlatforms {
  CoinGecko = 'CoinGecko',
}

export enum CryptoCurrenciesCoins {
  Cardano = 'cardano',
}

export interface CryptoCurrency {
  id: string;
  symbol: string;
}

export interface CryptoCurrencies {
  [id: string]: CryptoCurrency;
}
