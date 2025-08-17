// src/atoms/market.js
import { atomWithStorage } from "jotai/utils";

// 기본값은 null (아직 선택 안 했을 때)
export const currentMarketIdAtom = atomWithStorage("currentMarketId", null);
