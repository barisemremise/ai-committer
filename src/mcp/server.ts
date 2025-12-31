import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getGitDiff } from "../core/git.util";
import { getSystemPrompt, getUserPrompt } from "../core/prompt.util";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "@/config.util";
import { GenerateCommitInputSchema } from "./schema";

export async function mcpRun() {
  const server = new McpServer({
    name: "ai-committer",
    version: "0.1.0",
  });

  server.registerTool(
    "generate_ai_commits",
    {
      title: "Generate Commit Messages",
      description:
        "Generates commit messages from git diff and given conventions.",
      inputSchema: GenerateCommitInputSchema,
    },
    async (args) => {
      try {
        const validatedArgs = GenerateCommitInputSchema.parse(args);
        const {
          repoPath,
          diffMode = "staged",
          numberOfSuggestions = 3,
        } = validatedArgs;

        const config = loadConfig(repoPath);

        const {
          commitConfig: { language, conventions },
        } = config;

        const diff = getGitDiff(diffMode, repoPath);

        if (!diff.trim()) {
          return {
            content: [{ type: "text" as const, text: "No git diff found." }],
          };
        }

        const systemPrompt = getSystemPrompt({
          numberOfSuggestions,
          language,
          conventions,
        });

        const userPrompt = getUserPrompt({ diff, language });

        return {
          content: [
            {
              type: "text" as const,
              text: `
SYSTEM:
${systemPrompt}

USER:
${userPrompt}
              `.trim(),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
