import { createEmbedding } from "../lib/createEmbedding";
import { listFilesByExtension } from "../lib/listFilesByExtension";
import { loadText } from "../lib/loadText";
import { resolvePath } from "../lib/resolvePath";
import { saveText } from "../lib/saveText";

export const embed = async (document: string): Promise<string> => {
  const { embedding } = await createEmbedding(document);
  return JSON.stringify({ document, embedding }, null, 2);
};

export const embeddingSuffix = ".embedding.json";

export const createDocumentEmbeddingCommand = async (path: string) => {
  if (await loadText(path + embeddingSuffix)) {
    console.log(`Embedding already exists for ${path}`);
    return;
  }

  const document = await loadText(path);
  if (!document) {
    console.log(`No document found at path ${path}`);
    return;
  }

  const embeddingResponse = await createEmbedding(document);

  if (!embeddingResponse) {
    console.log(`Embedding creation failed for ${path}`);
    return;
  }

  const embedding = embeddingResponse.data[0]?.embedding;
  if (!embedding) {
    console.log(`Embedding creation failed for ${path}`);
    return;
  }

  saveText(
    path + embeddingSuffix,
    JSON.stringify({ document, embedding }, null, 2)
  );

  console.log(`Embedding created and saved to ${path + embeddingSuffix}`);
};

export const createEmbeddingsForDirectoryCommand =
  (extension: string) => async (path: string) => {
    const resolvedPath = await resolvePath(path);
    const files = await listFilesByExtension(resolvedPath, extension);
    await Promise.allSettled(files.map(createDocumentEmbeddingCommand));
  };
