import { DatabasePool, sql } from "slonik";
import { ExampleEntity } from "../entities/example.entity";
import { GettableRepository } from "./repository";
import z from "zod";
import { Lazy } from "../types/lazy";

const rowSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export interface ExampleEntityRepository
  extends GettableRepository<ExampleEntity> {}

export const exampleEntityRepositoryFactory = (
  getPool: Lazy<DatabasePool, true>,
): ExampleEntityRepository => {
  return {
    async get(id) {
      const queryResult = await getPool().query(
        sql.type(rowSchema)`SELECT * FROM example_entity WHERE id = ${id}`,
      );

      return queryResult.rows[0] ?? null;
    },
  };
};
