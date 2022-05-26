export interface CryptoCurrency {
  id: string;
  symbol: string;
}

export interface CryptoCurrencies {
  [id: string]: CryptoCurrency;
}
