import fs from "node:fs/promises";

export async function saveText(targetFile: string, text: string) {
  await fs.writeFile(targetFile, text);
}
