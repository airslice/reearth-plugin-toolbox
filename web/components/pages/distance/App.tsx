import styled from "@emotion/styled";
import * as turf from "@turf/turf";
import Button from "@web/components/atoms/Button";
import Line from "@web/components/atoms/Line";
import Panel from "@web/components/molecules/Panel";
import type { actHandles } from "@web/types";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";

import "@web/components/molecules/Common/common.css";
import "./app.css";

type MouseEvent = {
  x?: number;
  y?: number;
  lat?: number;
  lng?: number;
  height?: number;
  layerId?: string;
  delta?: number;
};

type Point = {
  lat: number;
  lng: number;
  layerId?: string;
};

const App = () => {
  const isActive = useRef(false);
  const isRecording = useRef(false);
  // const isModifying = useRef(false);
  // const modifyingPoint = useRef<Point>();

  const measureIndex = useRef(0);
  const points = useRef<Point[]>([]);
  const lineId = useRef<string>("");
  const distances = useRef<number[]>([]);
  const unit = useRef<"kilometers" | "miles">("kilometers");

  const [buttonText, setButtonText] = useState("Start");
  const [totalDistance, setTotalDistance] = useState<string>("0.00");
  const [displayUnit, setDisplayUnit] = useState("km");

  const handleActiveChange = useCallback((active: boolean) => {
    isActive.current = active;
  }, []);

  const clear = useCallback(() => {
    (globalThis as any).parent.postMessage(
      {
        act: "clearPoints",
        payload: points.current.map((point) => point.layerId),
      },
      "*"
    );
    (globalThis as any).parent.postMessage(
      {
        act: "clearLine",
        payload: lineId.current,
      },
      "*"
    );
    points.current = [];
    // lineId.current = "";
    distances.current = [];
    // isModifying.current = false;
    // modifyingPoint.current = undefined;
    setTotalDistance("0.00");
  }, []);

  const start = useCallback(() => {
    clear();
    isRecording.current = true;
    measureIndex.current += 1;
  }, [clear]);

  const finish = useCallback(() => {
    if (isRecording.current) {
      isRecording.current = false;
      setTotalDistance(calcTotalDistance().toFixed(2));
      setButtonText("Start");
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (!isRecording.current) {
      start();
    } else {
      finish();
    }
    setButtonText(isRecording.current ? "Finish" : "Start");
  }, [start, finish]);

  const onResize = (width: number, height: number) => {
    (globalThis as any).parent.postMessage(
      {
        act: "resize",
        payload: [width, height],
      },
      "*"
    );
  };

  const calcDistance = useCallback((p1: Point, p2: Point) => {
    const from = turf.point([p1.lng, p1.lat]);
    const to = turf.point([p2.lng, p2.lat]);
    const options = { units: unit.current as turf.Units };

    return turf.distance(from, to, options);
  }, []);

  const addPoint = useCallback(
    (lat: number, lng: number) => {
      (globalThis as any).parent.postMessage(
        {
          act: "addPoint",
          payload: {
            lat,
            lng,
            mIndex: measureIndex.current,
            index: points.current.length,
          },
        },
        "*"
      );

      points.current.push({
        lat,
        lng,
      });

      if (points.current.length > 1) {
        distances.current.push(
          calcDistance(
            points.current[points.current.length - 2],
            points.current[points.current.length - 1]
          )
        );
      }
    },
    [calcDistance]
  );

  const addLine = useCallback((lat: number, lng: number) => {
    (globalThis as any).parent.postMessage(
      {
        act: "addLine",
        payload: {
          lat,
          lng,
          mIndex: measureIndex.current,
        },
      },
      "*"
    );
  }, []);

  const updateLine = useCallback(() => {
    if (points.current.length > 1) {
      const coords: any[] = [];
      points.current.forEach((point) => {
        coords.push({
          lat: point.lat,
          lng: point.lng,
          height: 0,
        });
      });
      (globalThis as any).parent.postMessage(
        {
          act: "updateLine",
          payload: {
            coords,
            layerId: lineId.current,
          },
        },
        "*"
      );
    }
  }, []);

  // const updatePoint = useCallback((point: Point) => {
  //   (globalThis as any).parent.postMessage(
  //     {
  //       act: "updatePoint",
  //       payload: {
  //         location: {
  //           lat: point.lat,
  //           lng: point.lng,
  //         },
  //         layerId: point.layerId,
  //       },
  //     },
  //     "*"
  //   );
  // }, []);

  const handlePointAdded = useCallback(
    ({ index, layerId }: { index: number; layerId: string }) => {
      points.current[index].layerId = layerId;
    },
    []
  );

  const handleLineAdded = useCallback(({ layerId }: { layerId: string }) => {
    lineId.current = layerId;
  }, []);

  const handleClick = useCallback(
    (mousedata: MouseEvent) => {
      if (!isActive.current) return;
      if (isRecording.current && mousedata.lat && mousedata.lng) {
        addPoint(mousedata.lat, mousedata.lng);
        if (points.current.length === 1) {
          // addLine(mousedata.lat, mousedata.lng);
        } else {
          updateLine();
        }
      }
    },
    [addPoint, updateLine]
  );

  const handleMouseMove = useCallback(
    (mousedata: MouseEvent) => {
      if (!isActive.current) return;
      if (
        isRecording.current &&
        points.current.length > 0 &&
        mousedata.lat &&
        mousedata.lng
      ) {
        const d = calcDistance(
          { lat: mousedata.lat, lng: mousedata.lng },
          points.current[points.current.length - 1]
        );
        setTotalDistance((d + calcTotalDistance()).toFixed(2));
      }
      // else if (
      //   isModifying.current &&
      //   modifyingPoint.current &&
      //   mousedata.lat &&
      //   mousedata.lng
      // ) {
      //   modifyingPoint.current.lat = mousedata.lat;
      //   modifyingPoint.current.lng = mousedata.lng;
      //   updatePoint(modifyingPoint.current);
      // }
    },
    [calcDistance]
  );

  // const handleMouseDown = useCallback((mousedata: MouseEvent) => {
  //   if (!isActive.current || isRecording.current) return;
  //   if (mousedata.layerId) {
  //     points.current.forEach((p) => {
  //       if (p.layerId && p.layerId === mousedata.layerId) {
  //         isModifying.current = true;
  //         modifyingPoint.current = p;
  //       }
  //     });
  //   }
  // }, []);

  // const handleMouseUp = useCallback(() => {
  //   if (!isActive.current || isRecording.current) return;
  //   isModifying.current = false;
  //   modifyingPoint.current = undefined;
  // }, []);

  const reCalcDistances = useCallback(() => {
    if (points.current.length <= 1) return;
    for (let i = 0, m = points.current.length; i < m - 1; i += 1) {
      distances.current[i] = calcDistance(
        points.current[i],
        points.current[i + 1]
      );
    }
  }, [calcDistance]);

  const calcTotalDistance = () => {
    if (distances.current.length < 1) {
      return 0;
    }
    let total = 0;
    for (let i = 0, m = distances.current.length; i < m; i += 1) {
      total += distances.current[i];
    }
    return total;
  };

  const toggleUnit = useCallback(() => {
    if (unit.current === "kilometers") {
      unit.current = "miles";
      setDisplayUnit("miles");
    } else {
      unit.current = "kilometers";
      setDisplayUnit("km");
    }
    reCalcDistances();
    setTotalDistance(calcTotalDistance().toFixed(2));
  }, [reCalcDistances]);

  const actHandles: actHandles = useMemo(() => {
    return {
      click: handleClick,
      mousemove: handleMouseMove,
      pointAdded: handlePointAdded,
      lineAdded: handleLineAdded,
      rightclick: finish,
      // mousedown: handleMouseDown,
      // mouseup: handleMouseUp,
    };
  }, [
    handleClick,
    handleMouseMove,
    // handleMouseDown,
    // handleMouseUp,
    handlePointAdded,
    handleLineAdded,
    finish,
  ]);

  const init = useCallback(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    });

    //
    addLine(0, 0);
  }, [actHandles, addLine]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Panel
      title="Distance Measurement"
      onResize={onResize}
      onFoldChange={handleActiveChange}
      icon="ruler"
    >
      <Result>
        {totalDistance}
        <Unit onClick={toggleUnit}>{displayUnit}</Unit>
      </Result>
      <Line>
        <Button
          text={buttonText}
          onClick={toggleRecording}
          extendWidth={true}
        />
        <Button
          text="Clear"
          onClick={clear}
          extendWidth={true}
          disabled={!!isRecording.current || points.current.length === 0}
        />
      </Line>
    </Panel>
  );
};

const Result = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  height: 40px;
`;
const Unit = styled.a`
  padding-left: 10px;
  cursor: pointer;
  user-select: none;
`;

export default App;
