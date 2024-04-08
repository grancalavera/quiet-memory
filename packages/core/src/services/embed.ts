import { z } from "zod";
import { createEmbedding } from "../lib/createEmbedding";
import { DocumentDescription } from "./describe";

export const EmbeddingDescription = DocumentDescription.extend({
  embedding: z.array(z.number()),
});

export type EmbeddingDescription = z.infer<typeof EmbeddingDescription>;

export const embed = async (
  documentDescription: DocumentDescription
): Promise<EmbeddingDescription> => {
  const embedding = await createEmbedding(documentDescription.document);
  return { ...documentDescription, embedding };
};
