import { z } from "zod";

export const CommitMessageSchema = z.object({
  commitMessages: z.array(z.string()).min(1),
});
