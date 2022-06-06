import { plot, Plot } from 'nodeplotlib';

export class PlotService {
  /**
   * plot
   * @param seriesSets
   */
  plotData(seriesSets: Plot[]) {
    plot(seriesSets);
  }
}
