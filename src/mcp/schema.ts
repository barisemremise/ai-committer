import { z } from "zod";

export const GenerateCommitInputSchema = z.object({
  repoPath: z.string(),
  diffMode: z.enum(["staged", "all"]).optional().default("staged"),
  numberOfSuggestions: z.number().optional().default(3),
});

export const CommitChangesInputSchema = z.object({
  repoPath: z.string(),
  message: z.string().min(1),
  diffMode: z.enum(["staged", "all"]).default("staged"),
  isAutoPush: z.boolean().default(false),
});
