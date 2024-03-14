import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { api } from "@repo/api/v1";
import { initServer } from "@ts-rest/fastify";
import { generateOpenApi } from "@ts-rest/open-api";
import fastify, { FastifyInstance } from "fastify";
import path from "path";
import { createClient, RedisClientType } from "redis";
import { createPool } from "slonik";
import packageJson from "../package.json";
import { redisServiceFactory } from "./adapters/cache.adapter";
import { Config } from "./config";
import { cacherFactory } from "./framework/cached";
import { getFromContext } from "./framework/context";
import { layzInit } from "./framework/lazy-init";
import { rootLogger } from "./framework/logger";
import { exampleEntityRepositoryFactory } from "./repositories/example-entity.repo";
import { getExampleEntityRouteHandlerFactory } from "./routes/get-example-entity.handler";
import { getExampleEntityUseCaseFactory } from "./use-cases/get-example-entity.use-case";

const s = initServer();

interface App {
  run: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server: FastifyInstance<any, any, any, any, any>["server"];
}

export const createApp = (config: Config): App => {
  const redisClient = createClient({
    url: config.redis.url,
  }) as RedisClientType;

  const openapi = generateOpenApi(api, {
    info: {
      title: "API",
      version: packageJson.version,
    },
  });

  const server = fastify({
    logger: rootLogger.child({ module: packageJson.name }),
  });

  const { value: pool, init: initPool } = layzInit(createPool);

  const exampleEntityRepository = exampleEntityRepositoryFactory(pool);

  const redisService = redisServiceFactory(
    {
      redisClient: redisClient,
    },
    {
      getLogger: () => getFromContext("logger"),
    },
  );

  const cache = cacherFactory({
    cacheAdapter: redisService,
    config: {
      ttlSeconds: config.cacheSeconds,
    },
  });

  const getExampleEntityUseCase = getExampleEntityUseCaseFactory({
    exampleEntityRepo: exampleEntityRepository,
  });

  const router = s.router(api, {
    example: s.router(api.example, {
      get: getExampleEntityRouteHandlerFactory({
        getExampleEntityUseCase,
        cache,
      }),
    }),
  });

  return {
    run: async () => {
      try {
        await initPool(config.postgres.url);
        await redisClient.connect();
        await server.register(cors, {});
        await server.register(s.plugin(router));
        await server.register(swagger, {
          mode: "static",
          specification: {
            path: "",
            postProcessor: function () {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return openapi as any;
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            document: openapi as any,
            baseDir: __dirname,
          },
        });
        await server.register(swaggerUI, {
          routePrefix: "/documentation",
          baseDir: path.resolve(__dirname, "static"),
          uiConfig: {
            docExpansion: "full",
            deepLinking: false,
          },
          staticCSP: true,
          transformStaticCSP: (header) => header,
          transformSpecification: () => openapi,
          transformSpecificationClone: true,
        });
        await server.ready();
        server.listen({ port: config.port, host: "0.0.0.0" });
      } catch (error) {
        server.log.error(error);
        throw error;
      }
    },
    server: server.server,
  };
};
