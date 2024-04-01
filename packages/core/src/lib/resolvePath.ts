import fs from "node:fs/promises";
import { resolve } from "node:path";

export async function resolvePath(apath: string): Promise<string> {
  const resolvedPath = resolve(apath);
  await fs.access(resolvedPath);
  return resolvedPath;
}
