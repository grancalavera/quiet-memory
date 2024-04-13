import { createEmbedding } from "../lib/createEmbedding";
import { Pool } from "pg";
import { DocumentMetadata } from "./describe";
import { EmbeddingDescription } from "./embed";
import { z } from "zod";

const db = new Pool();

type QueryOptions = {
  limit?: number;
  filter?: Partial<DocumentMetadata>;
};

const QueryResult = z.object({
  id: z.string(),
  similarity: z.number(),
  metadata: DocumentMetadata,
  embedding: z.array(z.number()),
  content: z.string(),
});

export type QueryResult = z.infer<typeof QueryResult>;

export const query = async (
  query: string,
  { filter = {}, limit = 3 }: QueryOptions = {}
): Promise<QueryResult[]> => {
  const embedding = await createEmbedding(query);

  const result = await db.query({
    text: `SELECT * from match_documents($1, $2, $3)`,
    values: [
      JSON.stringify(embedding),
      limit.toString(),
      JSON.stringify(filter),
    ],
  });

  return result.rows.flatMap((row): QueryResult[] => {
    const parsed = QueryResult.safeParse(row) ?? [];

    if (parsed.success) {
      return [parsed.data];
    }

    console.log("[query] failed to parse row: ", row, parsed.error);
    return [];
  });
};
