import axios from 'axios';
import Redis from 'ioredis';
import { Prices, PriceData } from '../dtypes';

const redisClient = new Redis();

export const fetchCryptoPrices = async (): Promise<Prices> => {
    const cacheKey = 'cryptoPrices';
    const cachedPrices = await redisClient.get(cacheKey);

    if (cachedPrices) {
        console.log('found in cache')
        return JSON.parse(cachedPrices);

    }

    try {
        console.log('fetching data')
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'bitcoin,ethereum,ripple', // Add more cryptocurrencies as needed
                vs_currencies: 'usd',
            },
        });

        const rawPrices: Record<string, { usd: number }> = response.data;
        const prices: Prices = rawPrices;

        
        await redisClient.set(cacheKey, JSON.stringify(prices), 'EX', 120); // Cache for 120 seconds
        return prices
    } catch (error) {
        console.error('Error fetching crypto prices', error);
        return {};
    }
};
