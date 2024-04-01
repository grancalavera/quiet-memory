import fs from "node:fs/promises";

export async function loadText(
  targetFile: string
): Promise<string | undefined> {
  try {
    return await fs.readFile(targetFile, "utf-8");
  } catch (error) {
    return undefined;
  }
}
