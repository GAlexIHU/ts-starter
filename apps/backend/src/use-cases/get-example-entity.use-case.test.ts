import { vi, test, expect, afterEach, beforeEach } from "vitest";
import { ExampleEntityRepository } from "../repositories/example-entity.repo";
import { getExampleEntityUseCaseFactory } from "./get-example-entity.use-case";
import { ExampleEntity } from "../entities/example.entity";

const exampleEntity: ExampleEntity = {
  id: "1",
  title: "test",
  description: "test",
};

const mockRepository: ExampleEntityRepository = {
  get: vi
    .fn<
      Parameters<ExampleEntityRepository["get"]>,
      ReturnType<ExampleEntityRepository["get"]>
    >()
    .mockImplementation(async (id) =>
      id === exampleEntity.id ? exampleEntity : null,
    ),
};

beforeEach(() => {
  vi.clearAllMocks();
});

test("should return the entity from the repository", async () => {
  const useCase = getExampleEntityUseCaseFactory({
    exampleEntityRepo: mockRepository,
  });

  const { result } = await useCase({ id: exampleEntity.id });

  expect(result).toEqual(exampleEntity);
});

test("should return NULL from the repository", async () => {
  const useCase = getExampleEntityUseCaseFactory({
    exampleEntityRepo: mockRepository,
  });

  const { result } = await useCase({ id: exampleEntity.id + "stg" });

  expect(result).toBeNull();
});

test("should throw with error of repository", async () => {
  const error = new Error("error");
  const mock = {
    ...mockRepository,
    get: vi
      .fn<
        Parameters<ExampleEntityRepository["get"]>,
        ReturnType<ExampleEntityRepository["get"]>
      >()
      .mockRejectedValue(error),
  };

  const useCase = getExampleEntityUseCaseFactory({
    exampleEntityRepo: mock,
  });

  await expect(useCase({ id: exampleEntity.id })).rejects.toThrowError(error);
});
