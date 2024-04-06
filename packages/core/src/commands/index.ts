import { edit } from "../services/edit";
import { detect } from "../services/detect";
import {
  ProcessDir,
  ProcessFile,
  makeDirCommand,
  makeFileCommand,
} from "./make-command";
import { describe } from "../services/describe";

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
  writeExtension: ".described.json",
};

const describeDir: ProcessDir = {
  ...describeFile,
  readExtension: detectDir.writeExtension,
};

export const detectFileCommand = makeFileCommand(detectFile);
export const detectDirCommand = makeDirCommand(detectDir);
export const editFileCommand = makeFileCommand(editFile);
export const editDirCommand = makeDirCommand(editDir);
export const describeCommand = makeFileCommand(describeFile);
export const describeDirCommand = makeDirCommand(describeDir);
