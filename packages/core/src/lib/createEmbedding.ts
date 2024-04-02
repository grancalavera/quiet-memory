import { openai } from "./openai";

export const createEmbedding = (text: string) =>
  openai.embeddings.create({
    // https://platform.openai.com/docs/guides/embeddings/embedding-models
    model: "text-embedding-3-small",
    input: text.replace(/\n/g, " "),
  });
