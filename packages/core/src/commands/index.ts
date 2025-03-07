import { basename, dirname, join } from "path";
import { createEmbedding } from "../lib/createEmbedding";
import { listFilesByExtension } from "../lib/listFilesByExtension";
import { loadText } from "../lib/loadText";
import { resolvePath } from "../lib/resolvePath";
import { saveText } from "../lib/saveText";
import { DocumentDescription, describe } from "../services/describe";
import { detect } from "../services/detect";
import { edit } from "../services/edit";
import { EmbeddingDescription, embed } from "../services/embed";
import { queryVectorStore, ragQuery } from "../services/query";
import { store } from "../services/store";
import {
  ProcessDir,
  ProcessFile,
  makeDirCommand,
  makeFileCommand,
} from "./make-command";

const extensions = {
  detected: ".detect.txt",
  edited: ".edit.txt",
  described: ".describe.json",
  embedded: ".embed.json",
};

const detectFile: ProcessFile = {
  run: detect,
  commandName: "detect",
  writeExtension: extensions.detected,
  customLoader: async (path) => path,
};

const detectDir: ProcessDir = {
  ...detectFile,
  readExtension: ".jpeg",
};

const editFile: ProcessFile = {
  run: edit,
  commandName: "edit",
  writeExtension: extensions.edited,
};

const editDir: ProcessDir = {
  ...editFile,
  readExtension: extensions.detected,
};

const describeFile: ProcessFile = {
  run: async (document) => {
    const description = await describe(document);
    return JSON.stringify(description, null, 2);
  },
  commandName: "describe",
  writeExtension: extensions.described,
};

const describeDir: ProcessDir = {
  ...describeFile,
  readExtension: extensions.edited,
};

const embedFile: ProcessFile = {
  run: async (jsonDescription) => {
    const documentDescription = DocumentDescription.parse(
      JSON.parse(jsonDescription)
    );
    const embeddingDescription = await embed(documentDescription);
    return JSON.stringify(embeddingDescription, null, 2);
  },
  commandName: "embed",
  writeExtension: extensions.embedded,
};

const embedDir: ProcessDir = {
  ...embedFile,
  readExtension: extensions.described,
};

export const detectFileCommand = makeFileCommand(detectFile);
export const detectDirCommand = makeDirCommand(detectDir);

export const editFileCommand = makeFileCommand(editFile);
export const editDirCommand = makeDirCommand(editDir);

export const describeCommand = makeFileCommand(describeFile);
export const describeDirCommand = makeDirCommand(describeDir);

export const embedCommand = makeFileCommand(embedFile);
export const embedDirCommand = makeDirCommand(embedDir);

export const storeEmbeddingCommand = async (path: string) => {
  const resolvedPath = await resolvePath(path);
  const json = await loadText(resolvedPath);

  if (!json) {
    console.error(
      `[store] could not load embedding from path: ${resolvedPath}`
    );
    return;
  }

  const embedding = EmbeddingDescription.parse(JSON.parse(json));
  const rows = await store([embedding]);
  console.log(`[store] ${rows.length} rows stored`);
};

export const storeEmbeddingDirCommand = async (path: string) => {
  const resolvedPath = await resolvePath(path);
  const files = await listFilesByExtension(resolvedPath, extensions.embedded);

  const results = await Promise.allSettled(
    files.map(async (file) => {
      const json = await loadText(file);
      if (!json) {
        const message = `[store-dir] could not load embedding from path: ${file}`;
        console.error(message);
        throw new Error(message);
      }
      return EmbeddingDescription.parse(JSON.parse(json));
    })
  );

  const embeddings = results
    .filter(
      (result): result is PromiseFulfilledResult<EmbeddingDescription> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);

  const rows = await store(embeddings);

  console.log(`[store-dir] ${rows.length} rows stored`);
};

export const embedQueryCommand = async (path: string, query: string) => {
  const dir = dirname(path);
  const file = basename(path);

  const embedding = await createEmbedding(query);

  const resolvedDir = await resolvePath(dir);
  const resolvedPath = join(resolvedDir, file);
  await saveText(resolvedPath, JSON.stringify(embedding));
  console.log(`[embed-query] done: ${resolvedPath}`);
};

export const naiveQueryCommand = async (queryString: string) => {
  const rows = await queryVectorStore(queryString);
  console.log(rows);
};

export const ragQueryCommand = async (queryString: string) => {
  const completion = await ragQuery(queryString);
  console.log(completion);
};

const processFile = async (path: string) => {
  console.log(`[process-file] ${path} detecting hand-written text`);
  const detectResult = await detect(path);

  console.log(`[process-file] ${path} editing hand-written text`);
  const editResult = await edit(detectResult);

  console.log(`[process-file] ${path} describing hand-written text`);
  const describeResult = await describe(editResult);

  console.log(`[process-file] ${path} embedding hand-written text`);
  const embedResult = await embed(describeResult);

  console.log(`[process-file] ${path} done`);
  return embedResult;
};

export const processFileCommand = async (path: string) => {
  const resolvedPath = await resolvePath(path);
  const embedResult = await processFile(resolvedPath);
  const storeResult = await store([embedResult]);
  console.log(`[process-file] ${storeResult.length} rows stored`);
};

export const processDirCommand = async (path: string, extension = ".jpeg") => {
  console.log(`[process-dir] path: ${path}, extension: ${extension}`);

  const resolvedPath = await resolvePath(path);
  const files = await listFilesByExtension(resolvedPath, extension);
  const results = await Promise.allSettled(files.map(processFile));

  console.log(`[process-dir] ${results.length} files processed`);
  const embeddings = results
    .filter(
      (result): result is PromiseFulfilledResult<EmbeddingDescription> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);

  const rows = await store(embeddings);
  console.log(`[process-dir] ${rows.length} rows stored`);
};
