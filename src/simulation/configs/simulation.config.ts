// models
import {
  CryptoCurrencyCoins,
  DataPlatforms,
} from '../../data/models/data.model.js';
// configs
import { cryptocurrencies } from '../../data/configs/cryptocurrencies.config.js';

const cryptocurrency = cryptocurrencies[CryptoCurrencyCoins.Control];

// data length subtract to allow result test values
export const simulationConfig = {
  cryptocurrency,
  dataPlatform: DataPlatforms.Coinbase,
  dataLength: 15,
  forecastLength: 1,
  simulationStatus: true,
  samplingFrequencySeconds: 1,
  hiddenLayers: [1],
  trainingSettings: {
    log: true,
    logPeriod: 100,
    iterations: 30000,
    errorThresh: 0.005,
  },
};
