import { useLayoutEffect, useRef, useState } from "react";
import { UPlotOptsBuilder } from "./UPlotOptsBuilder";
import { createPortal } from "react-dom";
import uPlot from "uplot";

interface UPlotDOMPluginProps {
    annos: number[];
    builder: UPlotOptsBuilder;
}

export const UPlotDOMPlugin = ({ builder, annos }: UPlotDOMPluginProps) => {
  const [uid] = useState(() => (Math.random() + 1).toString(36).substring(7));
  console.log(`UPlotDOMPlugin ${uid}: render()`, annos);

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
          const p = new Path2D();

          const zeroPos = u.valToPos(0, 'y', true);

          annoRef.current.forEach(val => {
            const x = u.valToPos(u.data[1].indexOf(val), "x", true);
            const y = u.valToPos(val, "y", true);

            p.moveTo(x, zeroPos);
            p.lineTo(x, y);
          });

          u.ctx.save();
          u.ctx.lineWidth = 2 * uPlot.pxRatio;
          u.ctx.strokeStyle = 'purple';
          u.ctx.setLineDash([10,10]);
          u.ctx.stroke(p);
          u.ctx.restore();
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

  const u = plotRef.current;

  if (u != null) {
    console.log(`UPlotDOMPlugin ${uid}: render markers`);

    const markers = annos.map((val) => (
      <div
        key={val}
        style={{
          position: "absolute",
          left: `${u.valToPos(u.data[1].indexOf(val), "x")}px`,
          top: `${u.valToPos(val, "y")}px`,
          transform: 'translate(-50%, -100%)',
        }}
      >
        {val}
      </div>
    ));

    return createPortal(markers, u.over);
  }

  return null;
};