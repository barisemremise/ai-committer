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
You are a commit message generator depends on the git diff.
Return **ONLY JSON** — an array of 3 short commit messages, no explanations.
Write concise, conventional commit-style messages based on code diffs. You should return 3 different choices. Return your response in this language: ${language}
Conventions: ${conventionString}.
`;

  const userPrompt = `
Here is the git diff:
\`\`\`diff
${diff}
\`\`\`

Generate clear and very short commit messages. Return your response in this language: ${language}.
`;

  const response = await client.chat.completions.create({
    model: model || "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: temperature || 0.4,
    max_completion_tokens: maxTokens,
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message?.content?.trim() || "").commit_messages;
}
