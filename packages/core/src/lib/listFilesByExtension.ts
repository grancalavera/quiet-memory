import { readdir, stat } from "fs/promises";
import { join } from "path";

export async function listFilesByExtension(
  directoryPath: string,
  extension: string
): Promise<string[]> {
  try {
    const files = await readdir(directoryPath);
    const filteredFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = join(directoryPath, file);
        const fileStat = await stat(filePath);
        if (fileStat.isFile() && file.endsWith(extension)) {
          return filePath;
        }
        return null;
      })
    );
    return filteredFiles.filter((file) => file !== null) as string[];
  } catch (error) {
    console.error(`Error listing files: ${error}`);
    return [];
  }
}
