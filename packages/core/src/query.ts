import { createEmbedding } from "./lib/createEmbedding";

export const queryCommand = async (query: string) => {
  const response = await createEmbedding(query);
  const embedding = response.data[0]?.embedding;
};
