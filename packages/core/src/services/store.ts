import { Pool } from "pg";
import { EmbeddingDescription } from "./embed";

const db = new Pool();

export const store = async (embeddings: EmbeddingDescription[]) => {
  const client = await db.connect();

  const values = embeddings.map(({ content, embedding, ...metadata }) => ({
    content,
    metadata,
    embedding,
  }));

  // https://github.com/brianc/node-postgres/issues/1644#issuecomment-595231696
  const result = await client.query({
    text: `
    INSERT INTO documents (content, metadata, embedding)
    SElECT content, metadata, embedding
    FROM jsonb_to_recordset($1::jsonb) AS t (content text, metadata jsonb, embedding vector)
    RETURNING *
    `,
    values: [JSON.stringify(values)],
  });
  client.release();

  return result.rows;
};
