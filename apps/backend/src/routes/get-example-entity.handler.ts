import { api, APIExampleEntity } from "@repo/api/v1";
import { ExampleEntity } from "../entities/example.entity";
import { Cacher } from "../framework/cached";
import { runInContext } from "../framework/context";
import { Logger } from "../framework/logger";
import { GetExampleEntityUseCase } from "../use-cases/get-example-entity.use-case";
import { AsyncUseCaseInput, AsyncUseCaseOutput } from "../use-cases/use-case";
import { RouteHandler } from "./route";

export const getExampleEntityRouteHandlerFactory: (deps: {
  getExampleEntityUseCase: GetExampleEntityUseCase;
  cache: Cacher;
}) => RouteHandler<typeof api.example.get> =
  ({ getExampleEntityUseCase, cache }) =>
  async ({ request, params: { id } }) => {
    const mapExampleEntity = (
      exampleEntity: ExampleEntity,
    ): APIExampleEntity.ExampleEntity => ({
      id: exampleEntity.id,
      title: exampleEntity.title,
      description: exampleEntity.description,
    });

    const { value } = await runInContext(
      { logger: request.log as unknown as Logger },
      cache<
        AsyncUseCaseInput<GetExampleEntityUseCase>,
        AsyncUseCaseOutput<GetExampleEntityUseCase>
      >(getExampleEntityUseCase),
    )({ id });

    if (value.result === null) {
      return {
        status: 404,
        body: {
          message: "Not Found",
        },
      };
    }

    return {
      status: 200,
      body: {
        result: mapExampleEntity(value.result),
      },
    };
  };
