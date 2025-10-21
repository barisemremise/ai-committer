import OpenAI from "openai";
import { AgentConfig, CommitConfig } from "@/types";

type GetCommitMessageParams = {
  diff: string,
  commitConfig: CommitConfig
  agentConfig: AgentConfig
}

export async function getCommitMessage(params: GetCommitMessageParams) {
  const { diff, commitConfig: { conventions, language }, agentConfig: { apiKey, model, temperature, maxTokens } } = params;

  const conventionString = conventions.map(c => `${c.prefix}: ${c.description}`).join("; ");

  const client = new OpenAI({ apiKey });

  const systemPrompt = `
You are a commit message generator.
Write concise, conventional commit-style messages based on code diffs. Return your response in this language: ${language}
Conventions: ${conventionString}.
`;

  const userPrompt = `
Here is the git diff:
\`\`\`diff
${diff}
\`\`\`

Generate a single, clear and very short commit message. Return your response in this language: ${language}.
`;

  const response = await client.chat.completions.create({
    model: model || "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: temperature || 0.4,
    max_completion_tokens: maxTokens,
  });

  console.log("🤖 AI Response:\n", response.choices[0].message?.content?.trim());

  return response.choices[0].message?.content?.trim() || "";
}
