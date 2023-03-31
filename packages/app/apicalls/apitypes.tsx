import { useQuery } from "@tanstack/react-query";
import { getDeviceStateAttributes } from "./apicalls";

export type deviceInfo = {
  manufacturer: string;
  modelName: string;
  modelDetails: {
    supportedAttachments: ["dustbin"];
  };
  implementation: string;
};

export const useDeviceState = () => {
  const { data, error, ...rest } = useQuery(
    ["deviceStateAttributes"],
    getDeviceStateAttributes
  );

  let chargingState = {
    chargingState: "none" as BatteryStateAttribute["flag"],
    chargeLevel: -1,
  };

  let statusState = {
    status: "idle" as StatusStateAttribute["value"],
    other: "none" as StatusStateAttribute["flag"],
  };

  if (data) {
    data.forEach((x) => {
      if (x.__class === "BatteryStateAttribute") {
        chargingState.chargeLevel = x.level;
        chargingState.chargingState = x.flag;
        return;
      }

      if (x.__class === "StatusStateAttribute") {
        statusState.status = x.value;
        statusState.other = x.flag;
      }
    });
  }

  return { chargingState, statusState, data, error, ...rest };
};
