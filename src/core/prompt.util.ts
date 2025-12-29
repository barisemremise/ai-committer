import { Convention, SystemPrompt, UserPrompt } from "../types";

export const getSystemPrompt = ({
  numberOfSuggestions,
  language,
  conventions,
}: SystemPrompt) => `
You are a commit message generator depends on the git diff.
You MUST return a JSON object exactly matching this schema:
{
  "commitMessages": string[]
}
No additional fields. No descriptions. No markdown.
Write concise, conventional commit-style messages based on code diffs. You must return ${numberOfSuggestions} different choices. Return your response in this language: ${language}
Conventions: ${getConventionString(conventions)}.
`;

export const getUserPrompt = ({ diff, language }: UserPrompt) => `
Here is the git diff:
\`\`\`diff
${diff}
\`\`\`

Generate clear and very short commit messages. Return your response in this language: ${language}.
`;

export const getConventionString = (conventions: Convention[]) => {
  return conventions.map((c) => `${c.prefix}: ${c.description}`).join("; ");
};
