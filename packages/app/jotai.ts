import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

type robots = {
  ip: string;
};

const storage = createJSONStorage<robots[]>(() => AsyncStorage);

export const robotsAtom = atomWithStorage<robots[]>("robots", [], storage);
