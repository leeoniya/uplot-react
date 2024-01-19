import uPlot from "uplot";
import {
  createRef,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Optional, usePrevious } from "./utils";
import { UPlotOptsBuilder } from "./UPlotOptsBuilder";

export type UPlotOptsDimless = Optional<uPlot.Options, "width" | "height">;

export interface UPlotReactProps {
  // opts: UPlotOptsDimless,
  builder: UPlotOptsBuilder;
  width: number;
  height: number;
  data: uPlot.AlignedData;
  children: () => React.ReactNode;
}

// this component should be keyed by unique opts/builder
export const UPlotReact = ({
  builder,
  width,
  height,
  data,
  children,
}: UPlotReactProps) => {
  const [uid] = useState(() => (Math.random() + 1).toString(36).substring(7));

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const domRef = createRef<HTMLDivElement>();
  const plotRef = useRef<uPlot>();

  const prevWidth = usePrevious(width);
  const prevHeight = usePrevious(height);
  const prevData = usePrevious(data);

  const u = plotRef.current;

  if (u != null) {
    if (data != prevData) {
      u.batch(() => {
        u.setData(data);
      });
    } else if (width != prevWidth || height != prevHeight) {
      u.batch(() => {
        u.setSize({ width, height });
      });
    }
  } else {
    // this lets plugins omit manually setting up setScale hooks to update possibly-portalled plugins on client-only zoom
    // builder.addHook('setScale');
    // todo: add setScales() hook?
  }

  useLayoutEffect(() => {
    console.log(`UPlotReact ${uid}: useLayoutEffect, new uPlot()`);

    plotRef.current = new uPlot(
      {
        width,
        height,
        ...builder.build(),
      },
      data,
      domRef.current!
    );

    // on mount we need to re-render plugins after uPlot init
    queueMicrotask(forceUpdate);

    return () => {
      console.log(`UPlotReact ${uid}: useLayoutEffect, u.destroy()`);

      plotRef.current?.destroy();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(`UPlotReact ${uid}: render()`);

  return <div ref={domRef}>{children()}</div>;
};
