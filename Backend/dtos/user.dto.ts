import { z } from "zod";

export const updateProfileDto = z.object({
  name: z.string().min(2),
});
