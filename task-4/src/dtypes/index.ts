// src/types/index.ts

// Interface for cryptocurrency price data
export interface PriceData {
    usd: number;
}

// Interface for prices object
export interface Prices {
    [crypto: string]: PriceData;
}

