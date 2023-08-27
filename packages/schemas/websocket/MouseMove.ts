import { z } from "zod";
import { Base } from "./Base";

export const MouseMove = Base.extend({
  type: z.literal("mouseMove"),
  payload: z.object({
    x: z.number(),
    y: z.number(),
    uuid: z.string(),
  }),
});
export type MouseMove = z.infer<typeof MouseMove>;
