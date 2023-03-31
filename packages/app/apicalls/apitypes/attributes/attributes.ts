type StatusAttribute =
  | BatteryStateAttribute
  | AttachmentStateAttribute
  | StatusStateAttribute
  | PresetSelectionStateAttribute
  | DockStatusStateAttribute;

type BatteryStateAttribute = {
  __class: "BatteryStateAttribute";
  metaData: {};
  level: number;
  flag: "none" | "charged" | "charging" | "discharging";
};

type AttachmentStateAttribute = {
  __class: "AttachmentStateAttribute";
  metaData: {};
  type: "dustbin" | "watertank" | "mop";
  attached: boolean;
};

type StatusStateAttribute = {
  __class: "StatusStateAttribute";
  metaData: {};
  value:
    | "error"
    | "docked"
    | "idle"
    | "returning"
    | "cleaning"
    | "paused"
    | "manual_control"
    | "moving";
  flag:
    | "none"
    | "zone"
    | "segment"
    | "spot"
    | "target"
    | "resumable"
    | "mapping";
};

type PresetSelectionStateAttribute = {
  __class: "PresetSelectionStateAttribute";
  metaData: {};
  type: "fan_speed" | "water_grade" | "operation_mode";
  value: "off" | "min" | "low" | "medium" | "high" | "max" | "turbo";
  customValue: number;
};

type DockStatusStateAttribute = {
  __class: "DockStatusStateAttribute";
  metaData: {};
  value: "error" | "idle" | "pause" | "emptying" | "cleaning" | "drying";
};
