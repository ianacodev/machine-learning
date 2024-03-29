// imports
import * as Brain from 'brain.js';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import log from 'loglevel';
// modules
import { Simulation } from './simulation/simulation.js';
// services
import { DataBrokerService } from './data/services/data-broker.service.js';
import { NormalizeDataService } from './data/services/normalize-data.service.js';
import { AnalyticsService } from './analytics/analytics.service.js';
// configs
import { mainConfig } from './config/main.config.js';

class Main {
  networkData: number[] = [];
  data$!: Observable<any>;
  dataService: any;
  network: any;

  constructor(
    private normalizeDataService: NormalizeDataService = new NormalizeDataService(),
    private analyticsService: AnalyticsService = new AnalyticsService(),
  ) {
    log.enableAll();
    if (mainConfig.simulationStatus) {
      log.warn('--Simulation Active--');
      const simulation = new Simulation();
      simulation.run();
    } else {
      log.info('--Init Process--');
      this.initData();
      this.startNetworkProcessing();
    }
  }

  /**
   * init data
   */
  initData() {
    const { dataPlatform, samplingFrequencySeconds, cryptocurrency } =
      mainConfig;
    log.info(
      `>> Initializing Data [sample freq ${samplingFrequencySeconds} (sec)]`,
    );
    const dataService = new DataBrokerService(dataPlatform);
    this.data$ = dataService.pollCryptoPrice(
      cryptocurrency,
      samplingFrequencySeconds,
    );
  }

  /**
   * start network processing
   */
  startNetworkProcessing() {
    log.info('>> Initializing Network Process');
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
          console.log('test', cryptoPrice);
          log.info(`[current price] ${name} $${amount}`);
          const { cryptocurrency } = mainConfig;
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
          const threshold = this.networkData.length >= mainConfig.dataLength;
          let msg;
          if (threshold) {
            msg = '>> Running network';
          } else {
            msg = '>> Consolidate data run';
          }
          log.info(`${msg} #${++networkRunCount}`);
          return threshold;
        }),
      )
      .subscribe(() => {
        const { trainingSettings, hiddenLayers } = mainConfig;
        this.network = new Brain.recurrent.LSTMTimeStep({ hiddenLayers });
        log.info('>> training network');
        this.network.train([this.networkData], trainingSettings);
        log.info('>> forecasting');
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
    const { dataNormalizeScale } = mainConfig;
    const networkDataDenormalized = this.normalizeDataService.denormalizeData<
      number[]
    >(this.networkData, dataNormalizeScale);
    const networkOutputDataDenormalized =
      this.normalizeDataService.denormalizeData<number>(
        networkOutputData,
        dataNormalizeScale,
      );
    this.analyticsService.analyze(
      networkDataDenormalized,
      networkOutputDataDenormalized,
    );
    // retain data sample length
    this.networkData.shift();
  }
}

// start
new Main();
