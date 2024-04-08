import { Pool } from "pg";
import { EmbeddingDescription } from "./embed";

const db = new Pool();

export const store = async ({
  embedding,
  document,
  ...metadata
}: EmbeddingDescription) => {
  const client = await db.connect();
  const result = await client.query({
    text: `INSERT INTO documents (content, metadata, embedding) VALUES ($1, $2, $3) RETURNING *`,
    values: [document, JSON.stringify(metadata), JSON.stringify(embedding)],
  });
  client.release();
  return result.rows;
};
