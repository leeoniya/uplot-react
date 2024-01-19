import { createRoot } from "react-dom/client";
import { UPlotOptsBuilder } from "./UPlotOptsBuilder";
import { UPlotDOMPlugin } from "./UPlotDOMPlugin";
import { UPlotReact } from "./UPlotReact";
import { AlignedData } from "uplot";

import '../node_modules/uplot/dist/uPlot.min.css';

let width = 600;
let height = 300;

let data: AlignedData = [
  [0, 1, 2, 3],
  [0, 5, 0, 7],
];

let annos = [7];

let builder = new UPlotOptsBuilder();
builder.addSeries({stroke: "red"});

const root = createRoot(document.getElementById('root')!);

root.render(
  <UPlotReact
    data={data}
    width={width}
    height={height}
    builder={builder}
    key={builder.key}
  >
    {() => <UPlotDOMPlugin builder={builder} annos={annos} />}
  </UPlotReact>
);

setTimeout(() => {
  console.log("-----size change-----");

  width = 800;
  height = 400;

  root.render(
    <UPlotReact
      data={data}
      width={width}
      height={height}
      builder={builder}
      key={builder.key}
    >
      {() => <UPlotDOMPlugin builder={builder} annos={annos} />}
    </UPlotReact>
  );
}, 2000);

setTimeout(() => {
  console.log("-----opts change-----");

  builder = new UPlotOptsBuilder();
  builder.addSeries({stroke: "blue"});

  root.render(
    <UPlotReact
      data={data}
      width={width}
      height={height}
      builder={builder}
      key={builder.key}
    >
      {() => <UPlotDOMPlugin builder={builder} annos={annos} />}
    </UPlotReact>
  );
}, 4000);

setTimeout(() => {
  console.log("-----data change-----");

  data = [
    [0, 1, 2, 3],
    [5, 0, 7, 0],
  ];

  root.render(
    <UPlotReact
      data={data}
      width={width}
      height={height}
      builder={builder}
      key={builder.key}
    >
      {() => <UPlotDOMPlugin builder={builder} annos={annos} />}
    </UPlotReact>
  );
}, 6000);


setTimeout(() => {
    console.log("-----data change-----");

    annos = [7,5];

    root.render(
      <UPlotReact
        data={data}
        width={width}
        height={height}
        builder={builder}
        key={builder.key}
      >
        {() => <UPlotDOMPlugin builder={builder} annos={annos} />}
      </UPlotReact>
    );
  }, 8000);