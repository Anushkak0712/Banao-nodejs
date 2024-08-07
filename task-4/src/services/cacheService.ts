import Redis from 'ioredis';

const redisClient = new Redis();

export const cacheData = async (key: string, data: any, ttl: number) => {
    await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
};

export const getCachedData = async (key: string): Promise<any> => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
};
