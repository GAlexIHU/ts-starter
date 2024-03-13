export type Lazy<T, Direct extends boolean = false> = Direct extends true
  ? () => T
  : T extends { [K: string | number | symbol]: any }
    ? {
        [K in keyof T as PropGetter<T, K>]: () => T[K];
      }
    : T extends (...args: any[]) => any
      ? (...args: Parameters<T>) => ReturnType<T>
      : () => T;

type PropGetter<T, K extends keyof T> = `get${Capitalize<string & K>}`;
