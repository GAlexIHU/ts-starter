import { initContract } from "@ts-rest/core";
import { exampleEntityContract } from "./example-entity";

const c = initContract();

export type * as APIExampleEntity from "./example-entity";

export const api = c.router({
  example: exampleEntityContract,
});
