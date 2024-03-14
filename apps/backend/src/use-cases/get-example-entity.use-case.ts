import { ExampleEntity } from "../entities/example.entity";
import { ExampleEntityRepository } from "../repositories/example-entity.repo";
import { AsyncUseCase } from "./use-case";

export type GetExampleEntityUseCase = AsyncUseCase<
  { id: ExampleEntity["id"] },
  {
    result: ExampleEntity | null;
  }
>;

export type GetExampleEntityUseCaseDependencies = {
  exampleEntityRepo: ExampleEntityRepository;
};

export const getExampleEntityUseCaseFactory: (
  deps: GetExampleEntityUseCaseDependencies,
) => GetExampleEntityUseCase =
  ({ exampleEntityRepo }) =>
  async ({ id }) => ({
    result: await exampleEntityRepo.get(id),
  });
