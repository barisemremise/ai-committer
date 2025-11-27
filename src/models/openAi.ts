import OpenAI from "openai";
import { GetCommitMessageParams } from "@/types";
import { getSystemPrompt, getUserPrompt } from "@/prompt.util";
import { CommitMessageSchema } from "./schema";

export async function getOpenAiCommitMessage(params: GetCommitMessageParams): Promise<string[]> {
  try {
    const { diff, commitConfig: { conventions, language }, agentConfig: { temperature, maxTokens }, model: { apiKey, model }, numberOfSuggestions = 3 } = params;

    const conventionString = conventions.map(c => `${c.prefix}: ${c.description}`).join("; ");

    const client = new OpenAI({ apiKey });

    const response = await client.chat.completions.create({
      model: model || "gpt-4o",
      messages: [
        { role: "system", content: getSystemPrompt({ numberOfSuggestions, language, conventionString }) },
        { role: "user", content: getUserPrompt({ diff, language }) },
      ],
      temperature: temperature || 0.4,
      max_completion_tokens: maxTokens,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message?.content?.trim();

    if (!content) {
      throw new Error("AI response is empty");
    }
    
    const parsed = JSON.parse(content);

    const validated = CommitMessageSchema.safeParse(parsed);

    if (!validated.success) {
      console.error(validated.error.message);
      throw new Error("AI response format is incorrect");
    }

    return validated.data.commitMessages;
  } catch (error) {
    throw new Error("Failed to parse AI response: " + error);
  }
}
