import { z } from "zod";

export const ExampleEntitySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
});

export type ExampleEntity = z.infer<typeof ExampleEntitySchema>;
