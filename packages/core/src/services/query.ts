import { Pool } from "pg";
import { z } from "zod";
import { createEmbedding } from "../lib/createEmbedding";
import { DocumentMetadata } from "./describe";
import { createCompletion } from "../lib/createCompletion";

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

export const queryVectorStore = async (
  query: string,
  { filter = {}, limit = 20 }: QueryOptions = {}
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

const ragQueryCompletion = (context: string) =>
  createCompletion(
    `Answer the question based on the following context: 
---
${context}
---
Do not use any other exixting information. Question:`
  );

export const ragQuery = async (query: string) => {
  const queryResult = await queryVectorStore(query);
  const context = queryResult.map((result) => result.content).join(" ");
  return ragQueryCompletion(context)(query);
};
