import vision from "@google-cloud/vision";
import { loadText } from "./lib/loadText";
import { resolvePath } from "./lib/resolvePath";
import { saveText } from "./lib/saveText";
import { listFilesByExtension } from "./lib/listFilesByExtension";

export const extractSuffix = ".text-detection.txt";

async function detectText(sourceFile: string) {
  const client = new vision.ImageAnnotatorClient({ projectId: "quiet-memory" });
  const [response] = await client.textDetection(sourceFile);
  const detection = response.fullTextAnnotation?.text ?? "";
  return detection.replace(/\n/g, " ");
}

export async function extractCommand(path: string, force = false) {
  const resolvedPath = await resolvePath(path);

  let result: string | undefined = undefined;

  if (!force) {
    result = await loadText(resolvedPath + extractSuffix);

    if (result) {
      console.log("Text already detected. Done.");
      return;
    }
  }

  result = await detectText(resolvedPath);
  const outPath = resolvedPath + extractSuffix;
  await saveText(outPath, result);
  console.log("Text detection complete: " + outPath);
}

export const extractDirCommand =
  (extension: string) => async (path: string) => {
    const resolvedPath = await resolvePath(path);
    const files = await listFilesByExtension(resolvedPath, extension);
    await Promise.allSettled(files.map((x) => extractCommand(x)));
  };
