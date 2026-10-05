import type { SoilResistanceInput } from "../../src/core/soil-resistance-types";
import { SAFE_TRADING_TIME } from "./system-time";

export const HEALTHY_SOLANA_SOIL: SoilResistanceInput = {
  symbol: "SOL",
  pythPriceUsd: 150,
  jupiterDepthUsd: 500_000,
  orcaDepthUsd: 500_000,
  orderSizeUsd: 500,
  accountBalanceUsd: 10_000,
  maxSlippage: 0.05,
  at: SAFE_TRADING_TIME,
};
