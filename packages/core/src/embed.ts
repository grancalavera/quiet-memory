import { listFilesByExtension } from "./lib/listFilesByExtension";
import { loadText } from "./lib/loadText";
import { openai } from "./lib/openai";
import { resolvePath } from "./lib/resolvePath";
import { saveText } from "./lib/saveText";

export const embeddingSuffix = ".embedding.json";

async function createEmbedding(path: string) {
  const text = await loadText(path);
  if (!text) {
    console.log(`No text found at path ${path}`);
    return;
  }

  const sanitised = text.replace(/\n/g, " ");

  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: sanitised,
  });

  return embedding;
}

export const createDocumentEmbeddingCommand = async (path: string) => {
  if (await loadText(path + embeddingSuffix)) {
    console.log(`Embedding already exists for ${path}`);
    return;
  }

  const embeddingResponse = await createEmbedding(path);

  if (!embeddingResponse) {
    console.log(`Embedding creation failed for ${path}`);
    return;
  }

  const embedding = embeddingResponse.data[0]?.embedding;
  if (!embedding) {
    console.log(`Embedding creation failed for ${path}`);
    return;
  }

  saveText(path + embeddingSuffix, JSON.stringify(embedding));

  console.log(`Embedding created and saved to ${path + embeddingSuffix}`);
};

export const createEmbeddingsForDirectoryCommand =
  (extension: string) => async (path: string) => {
    const resolvedPath = await resolvePath(path);
    const files = await listFilesByExtension(resolvedPath, extension);
    await Promise.allSettled(files.map(createDocumentEmbeddingCommand));
  };
