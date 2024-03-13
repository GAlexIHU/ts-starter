import { Lazy } from "../types/lazy";

export class LazyInitError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Wraps an async initialized value in a singleton sync getter
 */
export interface LazyInit<TRes, TArgs extends any[]> {
  value: Lazy<TRes, true>;
  init: (...args: TArgs) => Promise<TRes>;
}

export const layzInit = <TRes, TArgs extends any[]>(
  fn: LazyInit<TRes, TArgs>["init"],
): LazyInit<TRes, TArgs> => {
  let initialized = false;
  let value: TRes;

  return {
    value: () => {
      if (!initialized) {
        throw new LazyInitError("LazyInit not initialized");
      }
      return value;
    },
    init: async (...args: TArgs) => {
      if (initialized) {
        return value;
      }
      value = await fn(...args);
      initialized = true;
      return value;
    },
  };
};
