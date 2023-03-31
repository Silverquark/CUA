export interface RawMapData {
  metaData: RawMapDataMetaData;
  size: {
    x: number;
    y: number;
  };
  pixelSize: number;
  layers: RawMapLayer[];
  entities: RawMapEntity[];
}

export interface RawMapEntity {
  metaData: RawMapEntityMetaData;
  points: number[];
  type: RawMapEntityType;
}

export interface RawMapEntityMetaData {
  angle?: number;
  label?: string;
}

export interface RawMapLayer {
  metaData: RawMapLayerMetaData;
  type: RawMapLayerType;
  pixels: number[];
  compressedPixels?: number[];
  dimensions: {
    x: RawMapLayerDimension;
    y: RawMapLayerDimension;
    pixelCount: number;
  };
}

export interface RawMapLayerDimension {
  min: number;
  max: number;
  mid: number;
  avg: number;
}

export interface RawMapLayerMetaData {
  area: number;
  segmentId?: string;
  name?: string;
  active?: boolean;
}

export enum RawMapLayerType {
  Floor = "floor",
  Segment = "segment",
  Wall = "wall",
}

export enum RawMapEntityType {
  ChargerLocation = "charger_location",
  RobotPosition = "robot_position",
  GoToTarget = "go_to_target",
  Obstacle = "obstacle",
  Path = "path",
  PredictedPath = "predicted_path",
  VirtualWall = "virtual_wall",
  NoGoArea = "no_go_area",
  NoMopArea = "no_mop_area",
  ActiveZone = "active_zone",
}

export interface RawMapDataMetaData {
  version: number;
  nonce: string;
}

export function preprocessMap(data: RawMapData): RawMapData {
  if (data.metaData?.version === 2 && Array.isArray(data.layers)) {
    data.layers.forEach((layer) => {
      if (
        layer.pixels.length === 0 &&
        layer.compressedPixels &&
        layer.compressedPixels.length !== 0
      ) {
        for (let i = 0; i < layer.compressedPixels.length; i = i + 3) {
          const xStart = layer.compressedPixels[i];
          const y = layer.compressedPixels[i + 1];
          const count = layer.compressedPixels[i + 2];

          if (!xStart || !y || !count) {
            console.log("error on layer", layer);
            continue;
          }

          for (let j = 0; j < count; j++) {
            layer.pixels.push(xStart + j, y);
          }
        }

        delete layer.compressedPixels;
      }
    });
  }

  return data;
}
