import { createEmbedding } from "./lib/createEmbedding";
import { Pool } from "pg";
const db = new Pool();

export const queryCommand = async (query: string) => {
  const response = await createEmbedding(query);
  const embedding = response.data[0]?.embedding;
  if (!embedding) {
    console.log(`Embedding creation failed for ${query}`);
    return;
  }

  const result = await db.query({
    text: `SELECT * FROM pages ORDER BY embedding <=> $1 LIMIT 1`,
    values: [JSON.stringify(embedding)],
  });

  console.log(result.rows.map((x) => x.document));
};
