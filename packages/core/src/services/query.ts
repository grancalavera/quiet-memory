import { createEmbedding } from "../lib/createEmbedding";
import { Pool } from "pg";
import { DocumentMetadata } from "./describe";

const db = new Pool();

type QueryOptions = {
  limit?: number;
  filter?: Partial<DocumentMetadata>;
};

export const query = async (
  query: string,
  { filter = {}, limit = 3 }: QueryOptions = {}
) => {
  const embedding = await createEmbedding(query);

  if (!embedding) {
    console.log(`Embedding creation failed for ${query}`);
    return;
  }

  const result = await db.query({
    text: `SELECT * from match_documents($1, $2, $3)`,
    values: [
      JSON.stringify(embedding),
      limit.toString(),
      JSON.stringify(filter),
    ],
  });

  return result.rows;
};
