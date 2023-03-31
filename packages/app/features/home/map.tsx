import { Paragraph } from "@my/ui";
import {
  Canvas,
  Drawing,
  DrawingContext,
  Group,
  Line,
  Rect,
  rect,
  SkPoint,
  useValue,
} from "@shopify/react-native-skia";
import { setStringAsync } from "expo-clipboard";
import React, { useEffect } from "react";
import { useLink } from "solito/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMap } from "app/apicalls/apicalls";
import { RawMapData, RawMapLayer } from "app/apicalls/map";

import { Dimensions, View } from "react-native";

const { width, height } = Dimensions.get("window");

export function Map() {
  const { data, error } = useQuery(["map"], getMap);

  const matrix = useValue(Skia.Matrix());

  if (error) {
    return <Paragraph>{error}</Paragraph>;
  }
  if (!data) {
    return <Paragraph>Help there is no data</Paragraph>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1, backgroundColor: "#ff0000" }}>
        <Group matrix={matrix}>
          <LayerView data={data} />

          <Rect x={-1} y={-5000} width={2} height={10000} />
          <Rect x={-5000} y={-1} width={10000} height={2} />
        </Group>
      </Canvas>
      <GestureHandler debug matrix={matrix} />
    </View>
  );
}

import { Skia } from "@shopify/react-native-skia";
import { GestureHandler } from "./components/GestureHandler";

const paint = Skia.Paint();

export const LayerView = (props: { data: RawMapData }) => {
  const colors = [
    Skia.Color("#aabbee"),
    Skia.Color("#bbff88"),
    Skia.Color("#00cc88"),
    Skia.Color("#003388"),
  ];
  let xx = 0;
  let yy = 0;

  const onDraw = (ctx: DrawingContext) => {
    props.data.layers.forEach((layer, i) => {
      if (i === 0) {
        xx = layer.dimensions.x.mid;
        yy = layer.dimensions.y.mid;
        console.log({ xx, yy });
      }
      const cyan = paint.copy();
      cyan.setColor(colors[i]!);

      for (let i = 0; i < layer.pixels.length; i += 2) {
        const x = layer.pixels[i];
        const y = layer.pixels[i + 1];
        if (!x || !y) continue;
        ctx.canvas.drawRect(
          {
            x: x, //translateLayerXCoordinate(x),
            y: y, //translateLayerYCoordinate(y),
            width: 1,
            height: 1,
          },
          cyan
        );
      }
    });

    // Robot Path
    const pathPoints = props.data.entities.find(
      (x) => x.type === "path"
    )?.points;

    if (!pathPoints) {
      console.error("no pathPoints");
      return;
    }

    const pointCoors: SkPoint[] = [];
    for (let i = 0; i < pathPoints.length!; i += 2) {
      pointCoors.push(Skia.Point(pathPoints[i]!, pathPoints[i + 1]!));
    }
    const path = Skia.Path.Make();
    path.addPoly(pointCoors, false);

    const black = paint.copy();
    black.setColor(Skia.Color("black"));
    ctx.canvas.drawPath(path, black);
  };
  return (
    <Drawing
      transform={[{ translateX: -xx }, { translateY: -yy }, { scale: 1 }]}
      drawing={onDraw}
    />
  );
};

export const RobotView = (props: { data: RawMapData }) => {
  const onDraw = (ctx: DrawingContext) => {
    // Robot Location
    const white = paint.copy();
    white.setColor(Skia.Color("white"));

    const robotPosition = props.data.entities.find(
      (x) => x.type === "robot_position"
    );

    ctx.canvas.drawCircle(
      robotPosition?.points[0]!, //translateXCoordinate(robotPosition?.points[0]!),
      robotPosition?.points[1]!, //translateYCoordinate(robotPosition?.points[1]!),
      20,
      white
    );
  };
  return <Drawing transform={[{ scale: 1 }]} drawing={onDraw} />;
};
