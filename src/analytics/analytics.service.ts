import log from 'loglevel';
import { Plot } from 'nodeplotlib';
// services
import { PlotService } from '../data/services/plot.service.js';

export class AnalyticsService {
  seriesState: any = {};
  accuracySum: number = 0;
  runCount = 0;
  constructor(private plotService: PlotService = new PlotService()) {}

  analyze(networkData: number[], networkOutputData: number) {
    log.info('>> analyzing');
    if (!this.seriesState.realSeries) {
      this.seriesState.realSeries = networkData;
      this.seriesState.predictedSeries = [...networkData, networkOutputData];
    } else {
      this.seriesState.realSeries.push(networkData[networkData.length - 1]);
      this.seriesState.predictedSeries.push(networkOutputData);
    }
    this.runPlotProcess(
      this.seriesState.realSeries,
      this.seriesState.predictedSeries,
    );
    const realSeries = [...this.seriesState.realSeries];
    const predictedSeries = [...this.seriesState.predictedSeries];
    const currentRealValue = realSeries[realSeries?.length - 1];
    const previousPredictedValue = predictedSeries[predictedSeries?.length - 2];
    const currentPredictedValue = networkOutputData;
    const accuracy =
      ((previousPredictedValue - currentRealValue) /
        ((previousPredictedValue + currentRealValue) / 2)) *
      100 *
      100;
    log.info('--Results--');
    log.info('[real] current value: ', currentRealValue);
    log.info('[predicted] previous predicted value: ', previousPredictedValue);
    log.info('[predicted] next value:', currentPredictedValue);
    log.info('[accuracy]', accuracy, '%');
    this.runCount++;
    if (accuracy) {
      this.accuracySum += Math.abs(accuracy);
      log.info('[running accuracy avg]', this.accuracySum / this.runCount);
    }
    console.log(JSON.stringify(realSeries));
  }

  /**
   * run plot process
   * @param realSeries
   * @param networkOutputData
   */
  runPlotProcess(realSeries: number[] = [], predictedSeries: number[] = []) {
    let timeSeriesReal = [...Array(realSeries.length).keys()];
    let timeSeriesPredicted = [...Array(predictedSeries.length).keys()];
    const networkDataSeries: Plot = {
      x: timeSeriesReal,
      y: realSeries,
      name: 'real',
    };
    const networkOutputDataSeries: Plot = {
      x: timeSeriesPredicted,
      y: predictedSeries,
      name: 'predicted',
    };
    this.plotService.plotData([networkDataSeries, networkOutputDataSeries]);
  }
}
