import { AsyncUseCase } from "./use-case";
import { ExampleEntityRepository } from "../repositories/example-entity.repo";
import { ExampleEntity } from "../entities/example.entity";

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
  async ({ id }) => {
    return {
      result: await exampleEntityRepo.get(id),
    };
  };
