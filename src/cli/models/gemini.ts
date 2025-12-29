import { GoogleGenAI } from "@google/genai";
import { GetCommitMessageParams } from "@/types";
import { getSystemPrompt, getUserPrompt } from "@/core/prompt.util";
import { CommitMessageSchema } from "./schema";
import zodToJsonSchema from "zod-to-json-schema";

export async function getGeminiCommitMessage(
  params: GetCommitMessageParams
): Promise<string[]> {
  const {
    diff,
    commitConfig: { conventions, language },
    agentConfig: { temperature, maxTokens },
    model: { apiKey, model },
    numberOfSuggestions = 3,
  } = params;

  const client = new GoogleGenAI({ apiKey });

  const response = await client.models.generateContent({
    model: model || "gemini-2.5-flash",
    contents: getUserPrompt({ diff, language }),
    config: {
      systemInstruction: getSystemPrompt({
        numberOfSuggestions,
        language,
        conventions,
      }),
      temperature: temperature || 0.4,
      maxOutputTokens: maxTokens || 400,
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(CommitMessageSchema),
    },
  });

  if (!response.text) {
    throw new Error("AI response is empty");
  }

  return CommitMessageSchema.parse(JSON.parse(response.text)).commitMessages;
}
