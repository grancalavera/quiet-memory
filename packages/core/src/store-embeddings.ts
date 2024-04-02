import { basename } from "node:path";
import { Pool, PoolClient } from "pg";
import { listFilesByExtension } from "./lib/listFilesByExtension";
import { loadText } from "./lib/loadText";
import { resolvePath } from "./lib/resolvePath";

type EmbeddingDescription = {
  document: string;
  embedding: number[];
};

const db = new Pool();

const storeEmbedding =
  (client: PoolClient) =>
  async (path: string): Promise<void> => {
    const resolvedPath = await resolvePath(path);

    if (!resolvedPath) {
      console.error(`Could not resolve path: ${path}`);
      return;
    }

    const rawEmbedding = await loadText(resolvedPath);

    if (!rawEmbedding) {
      console.error(`Could not load embedding for from path: ${resolvePath}`);
      return;
    }

    const { document, embedding }: EmbeddingDescription =
      JSON.parse(rawEmbedding);

    const name = basename(path);

    const result = await client.query({
      text: `INSERT INTO pages(name, document, embedding) 
      VALUES($1, $2, $3) 
      ON CONFLICT (name) DO UPDATE SET 
      embedding = EXCLUDED.embedding,
      document = EXCLUDED.document
      RETURNING *`,
      values: [name, document, JSON.stringify(embedding)],
    });

    console.log(`Store embedding`, { result });
  };

export async function storeEmbeddingCommand(path: string) {
  const client = await db.connect();
  await storeEmbedding(client)(path);
  client.release();
}

export const storeEmbeddingsForDirectoryCommand =
  (extension: string) => async (path: string) => {
    const resolvedPath = await resolvePath(path);
    const files = await listFilesByExtension(resolvedPath, extension);
    const client = await db.connect();

    try {
      await client.query("BEGIN");
      await Promise.allSettled(files.map(storeEmbedding(client)));
      await client.query("COMMIT");
    } catch (e) {
      console.error(
        `Error storing embeddings for directory: ${resolvedPath}`,
        e
      );
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  };
