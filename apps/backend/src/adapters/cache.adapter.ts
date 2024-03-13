import { RedisClientType } from "redis";
import { Logger } from "../framework/logger";
import { Lazy } from "../types/lazy";

export interface CacheAdapter {
  get: <T>(key: string) => Promise<T | undefined>;
  set: <T>(key: string, value: T, expiration?: number) => Promise<void>;
}

export class CacheAdapterError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const redisServiceFactory: (
  deps: {
    redisClient: RedisClientType;
  },
  layzDeps: Lazy<{
    logger: Logger;
  }>,
) => CacheAdapter = ({ redisClient }, { getLogger }) => ({
  get: async (key) => {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : undefined;
    } catch (error) {
      getLogger().error(
        `Error getting value from cache for key "${key}"`,
        error,
      );
      throw new CacheAdapterError(
        `Error getting value from cache for key "${key}"`,
      );
    }
  },
  set: async (key, value, expiration) => {
    try {
      await redisClient.set(key, JSON.stringify(value), {
        EX: expiration,
      });
    } catch (error) {
      getLogger().error(`Error setting value for key "${key}"`, error);
      throw new CacheAdapterError(`Error setting value for key "${key}"`);
    }
  },
});
