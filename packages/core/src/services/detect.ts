import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({ projectId: "quiet-memory" });

export async function detect(path: string) {
  const [response] = await client.textDetection(path);
  const detection = response.fullTextAnnotation?.text ?? "";
  return detection.replace(/\n/g, " ");
}
