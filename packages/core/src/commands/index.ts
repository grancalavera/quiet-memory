import { loadText } from "../lib/loadText";
import { resolvePath } from "../lib/resolvePath";
import { DocumentDescription, describe } from "../services/describe";
import { detect } from "../services/detect";
import { edit } from "../services/edit";
import { EmbeddingDescription, embed } from "../services/embed";
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
  readExtension: extensions.edited,
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
      `[store-embeding] could not load embedding from path: ${resolvedPath}`
    );
    return;
  }

  const embedding = EmbeddingDescription.parse(JSON.parse(json));
  const rows = await store(embedding);
  console.log(`[store-embeding] ${rows.length} rows stored`);
};
