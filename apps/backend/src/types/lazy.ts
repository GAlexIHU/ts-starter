export type Lazy<T, Direct extends boolean = false> = Direct extends true
  ? () => T
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends { [K: string | number | symbol]: any }
    ? {
        [K in keyof T as PropGetter<T, K>]: () => T[K];
      }
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends (...args: any[]) => any
      ? (...args: Parameters<T>) => ReturnType<T>
      : () => T;

type PropGetter<T, K extends keyof T> = `get${Capitalize<string & K>}`;
