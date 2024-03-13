import convict from "convict";

const config = convict({
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 3000,
    env: "PORT",
  },
  postgres: {
    url: {
      doc: "The URL for the Postgres server.",
      format: String,
      default: "postgres://user:password@localhost:5432/db",
      env: "POSTGRES_URL",
    },
  },
  redis: {
    url: {
      doc: "The URL for the Redis server.",
      format: String,
      default: "redis://localhost:6379",
      env: "REDIS_URL",
    },
  },
  cacheSeconds: {
    doc: "The number of seconds to cache data.",
    format: "int",
    default: 120,
    env: "CACHE_SECONDS",
  },
});

type OfConfig<T> = T extends convict.Config<infer U> ? U : never;

export type Config = OfConfig<typeof config>;

export const getConfig = (): Config => {
  config.validate({ allowed: "strict" });
  return config.getProperties();
};
