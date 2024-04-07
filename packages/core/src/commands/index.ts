import { describe } from "../services/describe";
import { detect } from "../services/detect";
import { edit } from "../services/edit";
import { createEmbedding } from "../lib/createEmbedding";
import {
  ProcessDir,
  ProcessFile,
  makeDirCommand,
  makeFileCommand,
} from "./make-command";
import { embed } from "../services/embed";

const detectFile: ProcessFile = {
  processFile: detect,
  commandName: "detect",
  writeExtension: ".detect.txt",
  customLoader: async (path) => path,
};

const detectDir: ProcessDir = {
  ...detectFile,
  readExtension: ".jpeg",
};

const editFile: ProcessFile = {
  processFile: edit,
  commandName: "edit",
  writeExtension: ".edit.txt",
};

const editDir: ProcessDir = {
  ...editFile,
  readExtension: detectDir.writeExtension,
};

const describeFile: ProcessFile = {
  processFile: describe,
  commandName: "describe",
  writeExtension: ".describe.json",
};

const describeDir: ProcessDir = {
  ...describeFile,
  readExtension: editFile.writeExtension,
};

const embedFile: ProcessFile = {
  processFile: embed,
  commandName: "embed",
  writeExtension: ".embed.json",
};

const embedDir: ProcessDir = {
  ...embedFile,
  readExtension: editFile.writeExtension,
};

export const detectFileCommand = makeFileCommand(detectFile);
export const detectDirCommand = makeDirCommand(detectDir);

export const editFileCommand = makeFileCommand(editFile);
export const editDirCommand = makeDirCommand(editDir);

export const describeCommand = makeFileCommand(describeFile);
export const describeDirCommand = makeDirCommand(describeDir);

export const embedCommand = makeFileCommand(embedFile);
export const embedDirCommand = makeDirCommand(embedDir);
