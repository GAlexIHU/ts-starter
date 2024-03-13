import { expect, test, vi } from "vitest";
import { LazyInitError, layzInit } from "./lazy-init";

test("should throw error on unitialized value", () => {
  const { value } = layzInit(async () => 42);
  expect(() => value()).toThrowError(LazyInitError);
});

test("should return value after initialization", async () => {
  const { value, init } = layzInit(async () => 42);
  await init();
  expect(value()).toBe(42);
});

test("should only execute initialization once", async () => {
  const asyncInitialyzer = vi.fn().mockResolvedValue(42);
  const { value, init } = layzInit(asyncInitialyzer);
  await init();
  await init();
  expect(asyncInitialyzer).toHaveBeenCalledTimes(1);
  expect(value()).toBe(42);
});

test("should return referential equality on multiple calls", async () => {
  const val = { v: 42 };
  const { value, init } = layzInit(async () => val);
  await init();

  const first = value();
  const second = value();
  expect(first).toBe(second);
  expect(first).toBe(val);

  val.v = 43;
  const third = value();
  const fourth = value();
  expect(third).toBe(fourth);
  expect(third.v).toBe(43);
});

test("should pass arguments to initializer", async () => {
  const asyncInitialyzer = vi.fn().mockResolvedValue(42);
  const { init } = layzInit(asyncInitialyzer);
  await init(1, 2, 3);
  expect(asyncInitialyzer).toHaveBeenCalledWith(1, 2, 3);
});
