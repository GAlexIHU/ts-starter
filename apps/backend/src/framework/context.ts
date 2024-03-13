import { AsyncLocalStorage } from "async_hooks";
import { Logger, rootLogger } from "./logger";

export interface Context {
  readonly logger: Logger;
}

export const c: Context = {
  logger: rootLogger,
};

const asyncLocalStorage = new AsyncLocalStorage<Context>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

export const runInContext =
  <T extends AnyFn>(ctx: Context, fn: T) =>
  (...args: Parameters<T>): ReturnType<T> =>
    asyncLocalStorage.run<ReturnType<T>>(ctx, () => fn(...args));

export const getFromContext = <T extends keyof Context>(key: T): Context[T] => {
  const context = asyncLocalStorage.getStore();
  if (!context) {
    throw new Error("No context found");
  }
  return context[key];
};
