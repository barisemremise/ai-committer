import { GoogleGenAI } from "@google/genai";
import { GetCommitMessageParams } from "@/types";
import { getSystemPrompt, getUserPrompt } from "@/prompt.util";
import { CommitMessageSchema } from "./schema";
import zodToJsonSchema from "zod-to-json-schema";

export async function getGeminiCommitMessage(params: GetCommitMessageParams): Promise<string[]> {
  const { diff, commitConfig: { conventions, language }, agentConfig: { temperature, maxTokens }, model: { apiKey, model }, numberOfSuggestions = 3 } = params;

  const conventionString = conventions.map(c => `${c.prefix}: ${c.description}`).join("; ");

  const client = new GoogleGenAI({ apiKey });

  const response = await client.models.generateContent({
    model: model || "gemini-2.5-flash",
    contents: getUserPrompt({ diff, language }),
    config: {
      systemInstruction: getSystemPrompt({ numberOfSuggestions, language, conventionString }),
      temperature: temperature || 0.4,
      maxOutputTokens: maxTokens || 400,
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(CommitMessageSchema)
    }
  });

  if (!response.text) {
    throw new Error("AI response is empty");
  }

  return CommitMessageSchema.parse(JSON.parse(response.text)).commitMessages;
}
