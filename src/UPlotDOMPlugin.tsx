import { useLayoutEffect, useRef, useState } from "react";
import { UPlotOptsBuilder } from "./UPlotOptsBuilder";
import { createPortal } from "react-dom";

interface UPlotDOMPluginProps {
    annos: number[];
    builder: UPlotOptsBuilder;
}

export const UPlotDOMPlugin = ({ builder, annos }: UPlotDOMPluginProps) => {
  const [uid] = useState(() => (Math.random() + 1).toString(36).substring(7));
  const plotRef = useRef<uPlot>();

  const annoRef = useRef(annos);
  annoRef.current = annos;

  // set up hooks on initial render in single useLayoutEffect
  useLayoutEffect(() => {
    console.log(`UPlotDOMPlugin ${uid}: useLayoutEffect() setup`);

    builder.addHooks({
      init: [
        (u) => {
          console.log(`UPlotDOMPlugin ${uid}: uPlot init hook`);
          plotRef.current = u;
        },
      ],
      draw: [
        (u) => {
          console.log(`UPlotDOMPlugin ${uid}: uPlot draw`, u.data, annoRef.current);
        },
      ],
    });

    return () => {
        console.log(`UPlotDOMPlugin ${uid}: destroy()`);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    console.log(`UPlotDOMPlugin ${uid}: useLayoutEffect() marker redraw()`);
    plotRef.current?.redraw();
  }, [annos]);

  console.log(`UPlotDOMPlugin ${uid}: render()`);

  const u = plotRef.current;

  if (u != null) {
    console.log(`UPlotDOMPlugin ${uid}: render markers`);

    const markers = annos.map((val) => (
      <div
        key={val}
        style={{
          position: "absolute",
          left: `${u.valToPos(u.data[1].indexOf(val), "x")}px`,
        }}
      >
        {val}
      </div>
    ));

    return createPortal(markers, u.over);
  }

  return null;
};