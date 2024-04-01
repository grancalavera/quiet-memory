export function base64ToDataUrl(
  base64String: string,
  format: "jpeg" | "png"
): string {
  return `data:image/${format};base64,${base64String}`;
}
