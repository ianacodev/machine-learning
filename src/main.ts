// imports
import * as Brain from 'brain.js';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
// services
import { DataBrokerService } from './data/services/data-broker.service.js';
// models
import {
  CryptoCurrenciesCoins,
  DataPlatforms,
  CondensedMarketData,
} from './data/models/data.model.js';
// configs
import { cryptocurrencies } from './data/configs/cryptocurrencies.config.js';

export interface Tracking {
  runCount: number;
  currentPrice: number;
  previousPrice: number;
  predictedPrice: number;
  coinCount: number;
  loseCount: number;
  gainCount: number;
  initPosition: boolean;
}

class Main {
  readonly PATTERN_LENGTH = 35;
  readonly INVESTMENT_AMOUNT_USD = 100;
  pattern: number[] = [];
  network: any;
  tracking!: Tracking;
  dataService: any;
  data$!: Observable<CondensedMarketData>;

  constructor() {
    this.initTracking();
    this.initData();
    this.startNetworkProcessing();
  }

  /**
   * init tracking
   */
  initTracking() {
    this.tracking = {
      runCount: 0,
      currentPrice: 0,
      previousPrice: 0,
      predictedPrice: 0,
      coinCount: 0,
      loseCount: 0,
      gainCount: 0,
      initPosition: true,
    };
  }

  /**
   * init data
   */
  initData() {
    this.dataService = DataBrokerService.getService(DataPlatforms.CoinGecko);
    this.data$ = this.dataService.pollCondensedMarketData(
      cryptocurrencies[CryptoCurrenciesCoins.Cardano],
    );
  }

  /**
   * start network processing
   */
  startNetworkProcessing() {
    this.network = new Brain.recurrent.LSTMTimeStep();
    this.runNetworkProcess();
  }

  /**
   * run network process
   */
  runNetworkProcess() {
    console.log('--[Network Process] begin-----------');
    this.data$
      .pipe(
        map((data) => {
          const { current_price: currentPrice } = data;
          this.tracking.currentPrice = currentPrice;
          if (this.tracking.initPosition) {
            this.tracking.coinCount = this.INVESTMENT_AMOUNT_USD / currentPrice;
            this.tracking.initPosition = false;
            console.log(
              `[position]: (amount) ${this.INVESTMENT_AMOUNT_USD} USD (coins) ${this.tracking.coinCount}`,
            );
          }
          this.pattern.push(currentPrice);
          console.log(
            `(${++this.tracking.runCount})[train price]: ${
              this.tracking.currentPrice
            }`,
          );
        }),
        filter(() => this.pattern.length == this.PATTERN_LENGTH),
      )
      .subscribe(() => {
        const trainingConfig = {
          iterations: 4000,
          errorThresh: 0.0005,
        };
        this.network.train([this.pattern], trainingConfig);
        const output = this.network.run(this.pattern);
        this.updateTracking(output);
        this.pattern.shift();
      });
  }

  /**
   * update tracking
   * @param output
   */
  updateTracking(output: number) {
    const diff = this.tracking.currentPrice - this.tracking.predictedPrice;
    console.log('--------------------------------');
    console.log(`[predict price]: ${this.tracking.predictedPrice}`);
    console.log(`[current price]: ${this.tracking.currentPrice}`);
    if (this.tracking.previousPrice) {
      if (this.tracking.currentPrice !== this.tracking.previousPrice) {
        console.log(`[diff]: (${diff > 0 ? 'GAIN' : 'LOSE'}) ${diff}`);
        console.log(`[coin count] ${this.tracking.coinCount}`);
        diff > 0 ? this.tracking.gainCount++ : this.tracking.loseCount++;
        console.log(
          `[gain count:] ${this.tracking.gainCount} [loseCount]: ${this.tracking.loseCount}`,
        );
      } else {
        console.log('[No change]');
      }
      console.log(
        `[invest value]: ${
          this.tracking.coinCount * this.tracking.currentPrice
        }`,
      );
    }
    this.tracking.predictedPrice = output;
    this.tracking.previousPrice = this.tracking.currentPrice;
  }
}

// start
new Main();
