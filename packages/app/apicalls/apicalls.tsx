import axios from "axios";
import { deviceInfo } from "./apitypes";
import { preprocessMap, RawMapData } from "./map";

const api = axios.create({
  baseURL: "http://192.168.178.28/api/v2",
});

export const getDeviceInfo = async () => {
  const res = await api.get("/robot");
  return (await res.data) as deviceInfo;
};

export const getManualModeState = async () => {
  const res = await api.get("/robot/capabilities/ManualControlCapability");
  return res.data.enabled as boolean;
};

export const getDeviceStateAttributes = async () => {
  const res = await api.get("/robot/state/attributes");
  return res.data as StatusAttribute[];
};

export const setManualModeState = async (enable: boolean) => {
  return await api.put("/robot/capabilities/ManualControlCapability", {
    action: enable ? "enable" : "disable",
  });
};

export const basicControl = async (
  action: "start" | "stop" | "pause" | "home"
) => {
  return await api.put("/robot/capabilities/BasicControlCapability", {
    action: action,
  });
};

export const moveVaccum = async (
  action:
    | "forward"
    | "backward"
    | "rotate_counterclockwise"
    | "rotate_clockwise"
) => {
  return await api.put("/robot/capabilities/ManualControlCapability", {
    action: "move",
    movementCommand: action,
  });
};

export const getMap = async () => {
  const res = await api.get("/robot/state/map");
  let map = preprocessMap(res.data as RawMapData);
  return map;
};
