import { listFilesByExtension } from "../lib/listFilesByExtension";
import { loadText } from "../lib/loadText";
import { pathExists } from "../lib/pathExists";
import { resolvePath } from "../lib/resolvePath";
import { saveText } from "../lib/saveText";

export type CommandOptions = {
  force?: boolean;
};

export type ProcessFile = {
  run: (input: string) => Promise<string>;
  commandName: string;
  writeExtension: string;
  customLoader?: (path: string) => Promise<string | undefined>;
};

export type ProcessDir = ProcessFile & {
  readExtension: string;
};

export const makeFileCommand =
  (processor: ProcessFile) =>
  async (sourcePath: string, options: CommandOptions): Promise<void> => {
    console.log(`[${processor.commandName}] processing: ${sourcePath}`);
    const { force } = options;
    const {
      run: processFile,
      commandName,
      writeExtension,
      customLoader,
    } = processor;

    const resolvedPath = await resolvePath(sourcePath);
    const destPath = resolvedPath + writeExtension;

    if (!force && (await pathExists(destPath))) {
      console.log(
        `[${commandName}] source file already processed: ${sourcePath}`
      );
      return;
    }

    const input = customLoader
      ? await customLoader(resolvedPath)
      : await loadText(resolvedPath);

    if (!input) {
      console.log(`[${commandName}] no input found: ${sourcePath}`);
      return;
    }

    const result = await processFile(input);
    await saveText(destPath, result);
    console.log(`[${commandName}] done: ${destPath}`);
  };

export const makeDirCommand =
  (processDir: ProcessDir) =>
  async (dirPath: string, options: CommandOptions): Promise<void> => {
    const { readExtension, ...processor } = processDir;
    const processFileCommand = makeFileCommand(processor);
    const resolvedPath = await resolvePath(dirPath);
    const files = await listFilesByExtension(resolvedPath, readExtension);
    console.log(`[${processDir.commandName}] found:\n${files.join("\n")}`);
    Promise.allSettled(files.map((path) => processFileCommand(path, options)));
  };
