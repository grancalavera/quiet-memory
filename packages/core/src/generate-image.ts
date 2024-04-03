import { loadText } from "./lib/loadText";
import { openai } from "./lib/openai";
import { resolvePath } from "./lib/resolvePath";
import { saveText } from "./lib/saveText";

export const generateImageCommand = async (path: string) => {
  const resolvedPath = await resolvePath(path);
  const prompt = await loadText(resolvedPath);

  if (!prompt) {
    console.error(`No text found in ${resolvedPath}`);
    return;
  }

  const image = await openai.images.generate({
    model: "dall-e-3",
    size: "1792x1024",
    prompt,
  });

  const revisedPrompts = image.data
    .map((image) => image.revised_prompt)
    .join("\n");

  const urls = image.data.map((image) => image.url).join("\n");

  // save the previous prompt
  await saveText(`${resolvedPath}-${Date.now()}.txt`, prompt);

  //  and the revised prompts
  await saveText(resolvedPath, revisedPrompts);

  console.log(urls);
};
