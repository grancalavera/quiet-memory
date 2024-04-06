import { base64ToDataUrl } from "./lib/base64ToDataUrl";
import { listFilesByExtension } from "./lib/listFilesByExtension";
import { loadAndEncodeImageToBase64 } from "./lib/loadAndEncodeImageToBase64";
import { loadText } from "./lib/loadText";
import { openai } from "./lib/openai";
import { resolvePath } from "./lib/resolvePath";
import { saveText } from "./lib/saveText";

type ImageFormat = "jpeg" | "png";

export const describedSuffix = ".described.json";

async function describeHandwrite(
  base64Image: string,
  format: ImageFormat = "jpeg"
) {
  const userPrompt = `Perform these tasks:
  - Transcribe the text in the image, removing any unnecessary line breaks.`;
  // const userPrompt = `Transcribe the text in the image, removing any unnecessary line breaks.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: {
              url: base64ToDataUrl(base64Image, format),
            },
          },
        ],
      },
    ],
    temperature: 0,
  });

  return response.choices[0]?.message.content ?? "";
}

export async function describeCommand(path: string, force: boolean) {
  const resolvedPath = await resolvePath(path);

  let result: string | undefined = undefined;

  if (!force) {
    result = await loadText(resolvedPath + describedSuffix);

    if (result) {
      console.log(path + ": Page already described. Done.");
      return;
    }
  }

  console.log(path + ": loading and encoding image to base64");
  const base64 = await loadAndEncodeImageToBase64(resolvedPath);

  console.log(path + ": describing handwrite");
  result = await describeHandwrite(base64);
  const savePath = resolvedPath + describedSuffix;

  await saveText(savePath, result);

  console.log(path + ": Page description complete. Save at " + savePath);
}

export async function describeDirCommand(path: string, force: boolean) {
  const resolvedPath = await resolvePath(path);
  const files = await listFilesByExtension(resolvedPath, ".jpeg");
  await Promise.allSettled(files.map((x) => describeCommand(x, force)));
}
