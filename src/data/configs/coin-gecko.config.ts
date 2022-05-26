// models
import { cryptocurrencies } from './cryptocurrencies.config.js';

const apiBaseSettings = {
  tickers: false,
  market_data: true,
  community_data: false,
  developer_data: false,
  localization: false,
  sparkline: false,
};

export const coinGeckoConfig = {
  cryptocurrencies,
  apiFetchSettings: apiBaseSettings,
  apiHistorySettings: apiBaseSettings,
};
