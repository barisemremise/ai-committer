import { z } from "zod";

export const GenerateCommitInputSchema = z.object({
  repoPath: z.string(),
  diffMode: z.enum(["staged", "all"]).optional().default("staged"),
  numberOfSuggestions: z.number().optional().default(3),
});
