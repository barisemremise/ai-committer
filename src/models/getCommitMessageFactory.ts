import { AIModelEnum, GetCommitMessageParams } from "@/types";
import { get } from "http";
import { getOpenAiCommitMessage } from "./openAi";
import { getGeminiCommitMessage } from "./gemini";

export const getCommitMessageFactory = async (params: GetCommitMessageParams) => {
  const { model: { type } } = params;

  switch (type) {
    case AIModelEnum.OPENAI:
      return getOpenAiCommitMessage(params);
    case AIModelEnum.GEMINI:
      return getGeminiCommitMessage(params);
    default:
      throw new Error(`❌ Unsupported model type: ${type}`);
  }
}