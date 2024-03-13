import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ExampleEntitySchema } from "./example-entity.schema";

const c = initContract();

export const exampleEntityContract = c.router({
  get: {
    method: "GET",
    path: `/example-entities/:id`,
    pathParams: z.object({
      id: ExampleEntitySchema.shape.id,
    }),
    responses: {
      200: z.object({
        result: ExampleEntitySchema,
      }),
      404: z.object({
        message: z.string(),
      }),
    },
    summary: "Get a specific example entity by id",
    validateResponseOnClient: true,
  },
});
