// models
import { CryptoCurrencyCoins } from '../../data/models/data.model.js';

// control
export const simulationControlData = [
  30000, 31000, 32000, 32000, 34000, 35000, 36000, 37000, 38000, 39000, 40000,
  41000, 42000, 43000, 44000, 45000, 46000, 47000, 48000, 49000, 50000, 51000,
  52000, 53000, 54000,
];

// sampling frequency 30
export const simulationBitcoinData = [
  31372.53, 31340.34, 31340.34, 31304.1, 31304.1, 31281.7, 31281.7, 31267.2,
  31267.25, 31269.18, 31269.18, 31301.4, 31297.9, 31297.9, 31315.6, 31315.6,
  31315.6, 31332.9, 31332.9, 31379.09, 31379.09, 31399.02, 31399.02, 31440.87,
  31440.87,
];

// sampling frequency 10
export const simulationCardanoData = [
  0.557109, 0.557109, 0.556937, 0.556937, 0.556937, 0.556937, 0.556937,
  0.556937, 0.556937, 0.556937, 0.556937, 0.556937, 0.556937, 0.556937,
  0.557445, 0.557445, 0.556937, 0.557445, 0.557445, 0.557445, 0.557445,
  0.557445, 0.557366, 0.557366, 0.557366, 0.557366, 0.557366, 0.557366,
  0.557366, 0.557366, 0.557366, 0.557366, 0.557464, 0.557366, 0.557366,
  0.557464, 0.557464, 0.557464, 0.557464, 0.557464, 0.557464, 0.557464,
  0.557464, 0.557464, 0.557391, 0.557464, 0.557391, 0.557391,
];

// map
export const simulationDataMap: { [key: string]: number[] } = {
  [CryptoCurrencyCoins.Control]: simulationControlData,
  [CryptoCurrencyCoins.Bitcoin]: simulationBitcoinData,
  [CryptoCurrencyCoins.Cardano]: simulationCardanoData,
};
