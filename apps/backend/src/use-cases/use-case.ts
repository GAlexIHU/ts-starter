export type AsyncUseCase<T, U> = (props: T) => Promise<U>;

export type AsyncUseCaseInput<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends AsyncUseCase<infer U, any> ? U : never;
export type AsyncUseCaseOutput<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends AsyncUseCase<any, infer U> ? U : never;
