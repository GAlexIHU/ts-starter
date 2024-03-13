import { CacheAdapter } from "../adapters/cache.adapter";
import { AsyncUseCase } from "../use-cases/use-case";

interface CachingConfig {
  ttlSeconds: number;
}

type KeyHasher<T> = (args: T) => { value: string; hits: string };
export const defaultKeyHasher: KeyHasher<{ [s: string]: unknown }> = (args) => {
  const entries = Object.entries(args);
  const key = entries.map(([k, v]) => `${k}=${v}`).join(":") || "default";
  return {
    value: key,
    hits: `${key}:hits`,
  };
};

export type Cacher = <T = unknown, R = unknown>(
  useCase: AsyncUseCase<T, R>,
  keyHasher?: KeyHasher<T>,
) => AsyncUseCase<T, { value: R; cached: boolean }>;

export const cacherFactory =
  (deps: { cacheAdapter: CacheAdapter; config: CachingConfig }) =>
  <T, R>(
    useCase: AsyncUseCase<T, R>,
    keyHasher = defaultKeyHasher as KeyHasher<T>,
  ): AsyncUseCase<T, { value: R; cached: boolean }> =>
  async (args: T) => {
    const { hits: hitsKey, value: valueKey } = keyHasher(args);
    const { cacheAdapter, config } = deps;
    const cachedResults = await cacheAdapter.get<R>(valueKey);

    if (cachedResults) {
      // increment cache hit count
      const cacheHitCount = await cacheAdapter.get<number>(hitsKey);
      if (cacheHitCount) {
        await cacheAdapter.set(hitsKey, cacheHitCount + 1);
      } else {
        // failsafe
        await cacheAdapter.set(hitsKey, 1);
      }
      return {
        value: cachedResults,
        cached: true,
      };
    }

    const results = await useCase(args);
    await cacheAdapter.set(valueKey, results, config.ttlSeconds);
    await cacheAdapter.set(hitsKey, 0);
    return {
      value: results,
      cached: false,
    };
  };
