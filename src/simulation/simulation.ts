import * as Brain from 'brain.js';
import log from 'loglevel';
import { Observable, interval } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
// service
import { NormalizeDataService } from '../data/services/normalize-data.service.js';
import { AnalyticsService } from '../analytics/analytics.service.js';
// configs
import { simulationConfig } from './configs/simulation.config.js';
import { simulationDataMap } from './configs/simulation.data.config.js';

export class Simulation {
  networkData: number[] = [];
  network: any;
  data$!: Observable<any>;

  constructor(
    private normalizeDataService: NormalizeDataService = new NormalizeDataService(),
    private analyticsService: AnalyticsService = new AnalyticsService(),
  ) {}

  /**
   * run
   * @param trainMaxValue
   * @param testMinMaxValue
   * @param forecastCount
   */
  run() {
    log.info('--Init Simulation Process--');
    this.initData();
    this.startNetworkProcessing();
  }

  /**
   * init data
   */
  initData() {
    log.info(`>> [Simulation] Initializing Data`);
    const { cryptocurrency } = simulationConfig;
    const data = simulationDataMap[cryptocurrency.name].map((amount) => ({
      name: cryptocurrency.name,
      amount,
    })) as any;
    this.data$ = interval(
      simulationConfig.samplingFrequencySeconds * 1000,
    ).pipe(
      map((index) => data[index]),
      take(data.length),
    );
  }

  /**
   * start network processing
   */
  startNetworkProcessing() {
    log.info('>> [Simulation] Initializing Network Process');
    this.runNetworkProcess();
  }

  /**
   * run network process
   */
  runNetworkProcess() {
    let networkRunCount = 0;
    this.data$
      .pipe(
        map((cryptoPrice) => {
          const { name, amount } = cryptoPrice;
          log.info(`[current price] ${name} $${amount}`);
          const { cryptocurrency } = simulationConfig;
          const normalizedCurrentPrice =
            this.normalizeDataService.normalizeData(
              amount,
              cryptocurrency.normalize,
            );
          log.info(
            `[normalized current price]: ${normalizedCurrentPrice} scale: ${cryptocurrency.normalize}`,
          );
          this.networkData.push(normalizedCurrentPrice);
        }),
        filter(() => {
          const threshold =
            this.networkData.length >= simulationConfig.dataLength;
          let msg;
          if (threshold) {
            msg = '>> [Simulation] Running network';
          } else {
            msg = '>> [Simulation] Consolidating data';
          }
          log.info(`${msg} #${++networkRunCount} `);
          return threshold;
        }),
      )
      .subscribe(() => {
        const { trainingSettings, hiddenLayers } = simulationConfig;
        this.network = new Brain.recurrent.LSTMTimeStep({
          hiddenLayers,
        });
        log.info('>> [Simulation] training network');
        this.network.train([this.networkData], trainingSettings);
        log.info('>> [Simulation] forecasting');
        const networkOutputData = this.network.run(this.networkData);
        this.runPostNetworkProcess(networkOutputData);
      });
  }

  /**
   * run post network process
   * @param output
   */
  runPostNetworkProcess(networkOutputData: number) {
    log.info('>> run post network process');
    console.log('chec', this.networkData, networkOutputData);
    const { cryptocurrency } = simulationConfig;
    const networkDataDenormalized = this.normalizeDataService.denormalizeData<
      number[]
    >(this.networkData, cryptocurrency.normalize);
    const networkOutputDataDenormalized =
      this.normalizeDataService.denormalizeData<number>(
        networkOutputData,
        cryptocurrency.normalize,
      );
    this.analyticsService.analyze(
      networkDataDenormalized,
      networkOutputDataDenormalized,
    );
    // retain data sample length
    this.networkData.shift();
  }
}
