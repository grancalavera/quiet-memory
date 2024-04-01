import vision from "@google-cloud/vision";
import { resolvePath } from "./lib/resolvePath";
import { loadText } from "./lib/loadText";
import { saveText } from "./lib/saveText";
import { openai } from "./lib/openai";

const rawSuffix = ".raw.txt";
const editedSuffix = ".edited.txt";

async function detectText(sourceFile: string) {
  const client = new vision.ImageAnnotatorClient({ projectId: "quiet-memory" });
  const [response] = await client.textDetection(sourceFile);
  return response.fullTextAnnotation?.text ?? "";
}

async function editText(text: string) {
  const systemPrompt = `Act as a copy editor reviewing OCR results.
    Fix the provided copy for common errors like typos or mis-recognitions
    and misplaced line breaks. Don't add anything to the text, just the corrections.`;

  const result = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
    model: "gpt-4",
    temperature: 0.5,
  });

  return result.choices[0]?.message.content ?? "";
}

export async function extractAndEdit(path: string) {
  const resolvedPath = await resolvePath(path);
  let edited = await loadText(resolvedPath + editedSuffix);

  if (edited) {
    console.log("Text already detected and edited. Done.");
    return;
  }

  let detection = await loadText(resolvedPath + rawSuffix);

  if (detection) {
    console.log("Using cached text detection results");
  } else {
    console.log("Performing text detection...");
    detection = await detectText(resolvedPath);
    await saveText(resolvedPath + rawSuffix, detection);
  }

  console.log("Text detection complete");

  console.log("Editing text...");
  edited = await editText(detection);
  await saveText(resolvedPath + editedSuffix, edited);

  console.log("Text editing complete");
}
