import { UPlotOptsDimless } from "./UPlotReact";

// builder pattern for uPlot options
export class UPlotOptsBuilder {
  key = Math.random();

  series: uPlot.Series[] = [{}];

  hooks: uPlot.Hooks.Arrays = {};

  // cached
  opts: UPlotOptsDimless | null = null;

  addSeries(series: uPlot.Series) {
    this.series.push(series);
  }

  addHooks(hooks: uPlot.Hooks.Arrays) {
    this.hooks = hooks;
  }

  build() {
    if (this.opts == null) {
      this.opts = {
        scales: {
          x: {
            time: false,
          },
        },
        series: this.series,
        hooks: this.hooks,
      };
    }

    return this.opts;
  }
}
