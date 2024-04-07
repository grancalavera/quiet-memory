import { openai } from "./openai";

type EmbeddingDescription = {
  document: string;
  embedding: number[];
};

export const createEmbedding = async (
  document: string
): Promise<EmbeddingDescription> => {
  const response = await openai.embeddings.create({
    // https://platform.openai.com/docs/guides/embeddings/embedding-models
    model: "text-embedding-3-small",
    input: document.replace(/\n/g, " "),
  });
  const embedding = response.data[0]?.embedding ?? [];
  return { document, embedding };
};
