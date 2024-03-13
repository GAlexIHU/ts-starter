import { afterEach, describe, expect, test, vi } from "vitest";
import { CacheAdapter } from "../adapters/cache.adapter";
import { cacherFactory, defaultKeyHasher } from "./cached";

describe("defaultKeyHasher", () => {
  test("should return a key and a hits key", () => {
    const result = defaultKeyHasher({ a: 1, b: 2 });
    expect(result).toHaveProperty("value");
    expect(result).toHaveProperty("hits");
  });

  test("should return a key with the correct format", () => {
    const result = defaultKeyHasher({ a: 1, b: 2 });
    expect(result.value).toBe("a=1:b=2");
    expect(result.hits).toBe("a=1:b=2:hits");
  });

  test("should return dedicated string for empty object", () => {
    const result = defaultKeyHasher({});
    expect(result.value).toBe("default");
    expect(result.hits).toBe("default:hits");
  });
});

describe("cacherFactory", () => {
  const mockAdapter: CacheAdapter = {
    get: vi.fn().mockImplementation(() => Promise.resolve(undefined)),
    set: vi.fn().mockImplementation(() => Promise.resolve()),
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("should return cached=false and value=<usecase-return> if cache is not found", async () => {
    const usecase = vi
      .fn()
      .mockImplementation(() => Promise.resolve("results"));
    const cache = cacherFactory({
      cacheAdapter: {
        ...mockAdapter,
      },
      config: { ttlSeconds: 60 },
    });
    const res = await cache(usecase)({});
    expect(res.value).toBe("results");
    expect(res.cached).toBe(false);
  });

  test("should return cached=true and value=<cached-value> if cache is found", async () => {
    const usecase = vi
      .fn()
      .mockImplementation(() => Promise.resolve("results"));
    const cache = cacherFactory({
      cacheAdapter: {
        ...mockAdapter,
        get: vi.fn().mockImplementation(() => Promise.resolve("cached")),
      },
      config: { ttlSeconds: 60 },
    });
    const res = await cache(usecase)({});
    expect(res.cached).toBe(true);
    expect(res.value).toBe("cached");
  });

  test("should use the defaultKeyHasher when calling get & set", async () => {
    const args = { a: 1, b: 2 };
    const usecase = vi
      .fn()
      .mockImplementation(() => Promise.resolve("results"));
    const cache = cacherFactory({
      cacheAdapter: {
        ...mockAdapter,
      },
      config: { ttlSeconds: 60 },
    });
    await cache(usecase)(args);
    expect(mockAdapter.get).toHaveBeenCalledWith(defaultKeyHasher(args).value);
  });

  test("should use custom keyhasher when provided", async () => {
    const hasher = () => ({ value: "custom", hits: "custom:hits" });
    const usecase = vi
      .fn()
      .mockImplementation(() => Promise.resolve("results"));
    const cache = cacherFactory({
      cacheAdapter: {
        ...mockAdapter,
      },
      config: { ttlSeconds: 60 },
    });
    await cache(usecase, hasher)({});
    expect(mockAdapter.get).toHaveBeenCalledWith("custom");
  });

  test("should return the cached results and increment the cache hit count", async () => {
    const hasher = () => ({ value: "custom", hits: "custom:hits" });
    const usecase = vi
      .fn()
      .mockImplementation(() => Promise.resolve("results"));
    const mymock = {
      ...mockAdapter,
      get: vi
        .fn()
        .mockImplementation((key: string) =>
          Promise.resolve(key === "custom" ? "cached" : 1),
        ),
      set: vi.fn().mockImplementation(() => Promise.resolve()),
    };
    const cache = cacherFactory({
      cacheAdapter: mymock,
      config: { ttlSeconds: 60 },
    });
    await cache(usecase, hasher)({});
    expect(mymock.get).toHaveBeenCalledWith("custom");
    expect(mymock.get).toHaveBeenCalledWith("custom:hits");
    expect(mymock.set).toHaveBeenCalledWith("custom:hits", 2);
  });
  test("should return the results from the use case and set the cache", async () => {
    const hasher = () => ({ value: "custom", hits: "custom:hits" });
    const usecase = vi
      .fn()
      .mockImplementation(() => Promise.resolve("results"));
    const mymock = {
      ...mockAdapter,
      get: vi.fn().mockImplementation(() => Promise.resolve(undefined)),
      set: vi.fn().mockImplementation(() => Promise.resolve()),
    };
    const cache = cacherFactory({
      cacheAdapter: mymock,
      config: { ttlSeconds: 60 },
    });
    await cache(usecase, hasher)({});
    expect(mymock.get).toHaveBeenCalledWith("custom");
    expect(mymock.set).toHaveBeenCalledWith("custom", "results", 60);
    expect(mymock.set).toHaveBeenCalledWith("custom:hits", 0);
  });
});
