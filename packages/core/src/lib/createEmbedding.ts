import { openai } from "./openai";

export const createEmbedding = async (document: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    // https://platform.openai.com/docs/guides/embeddings/embedding-models
    model: "text-embedding-3-small",
    input: document.replace(/\n/g, " "),
  });
  return response.data[0]?.embedding ?? [];
};
