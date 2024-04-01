import fs from "node:fs/promises";

export async function loadAndEncodeImageToBase64(
  imagePath: string
): Promise<string> {
  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = imageBuffer.toString("base64");
  return base64Image;
}
