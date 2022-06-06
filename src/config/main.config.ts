// models
import {
  CryptoCurrencyCoins,
  DataPlatforms,
} from '../data/models/data.model.js';
// configs
import { cryptocurrencies } from '../data/configs/cryptocurrencies.config.js';

const cryptocurrency = cryptocurrencies[CryptoCurrencyCoins.Bitcoin];

export const mainConfig = {
  cryptocurrency,
  dataPlatform: DataPlatforms.Coinbase,
  dataLength: 15,
  dataNormalizeScale: cryptocurrency.normalize,
  forecastLength: 1,
  simulationStatus: true,
  samplingFrequencySeconds: 30,
  hiddenLayers: [5],
  trainingSettings: {
    log: true,
    logPeriod: 100,
    iterations: 30000,
    errorThresh: 0.0008,
  },
};
