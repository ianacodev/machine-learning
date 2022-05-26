// imports
import * as Brain from 'brain.js';
import { Observable } from 'rxjs';
import { bufferCount, tap, take, map } from 'rxjs/operators';
// services
import { DataBrokerService } from './data/services/data-broker.service.js';
// models
import {
  DataPlatforms,
  CondensedMarketData,
} from './data/models/data.model.js';
// configs
import { cryptocurrencies } from './config/cryptocurrencies.config.js';

class Main {
  readonly DEFAULT_TRAINING_INSTANCE_COUNT = 10;
  network: any;
  dataService: any;
  data$: Observable<CondensedMarketData>;

  constructor() {
    this.dataService = DataBrokerService.getService(DataPlatforms.CoinGecko);
    this.data$ = this.dataService.pollCondensedMarketData(
      cryptocurrencies['CARDANO'],
    );
    this.dataService.pollCondensedMarketData(cryptocurrencies['CARDANO']);
    this.initNetwork();
  }

  /**
   * init network
   */
  initNetwork() {
    this.network = new Brain.recurrent.LSTM();
    this.initNetworkTraining();
  }

  /**
   * init network training
   */
  initNetworkTraining(
    instanceCount: number = this.DEFAULT_TRAINING_INSTANCE_COUNT,
  ) {
    console.log('--[TRAINING] begin-----------');
    let count = 0;
    this.data$
      .pipe(
        tap((data) =>
          console.log(`[#${++count}] [train price]: ${data.current_price}`),
        ),
        bufferCount(instanceCount),
        map((dataSet) =>
          dataSet.map((data, index) => {
            const input = dataSet[index - 1]?.current_price;
            const output = data.current_price;
            return { input, output };
          }),
        ),
        take(1),
      )
      .subscribe((trainingData) => {
        const trainingConfig = {
          iterations: 150,
          log: (details: any) => console.log(details),
        };
        trainingData.shift();
        this.network.train(trainingData, trainingConfig);
        console.log('--[TRAINING] complete-----------');
        this.startNetworkRun();
      });
  }

  startNetworkRun(): any {
    console.log('--[Network Run] begin-----------');
    this.data$.subscribe((data) => {
      const { current_price } = data;
      const output = this.network.run(current_price);
      console.log(`[input]: ${current_price} [output]: ${output}`);
    });
  }
}

// start
new Main();
