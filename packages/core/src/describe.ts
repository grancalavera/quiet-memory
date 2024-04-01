import { base64ToDataUrl } from "./lib/base64ToDataUrl";
import { loadAndEncodeImageToBase64 } from "./lib/loadAndEncodeImageToBase64";
import { openai } from "./lib/openai";
import { resolvePath } from "./lib/resolvePath";

const describedSuffix = ".described.txt";

async function describeHandwrite(
  base64Image: string,
  format: "jpeg" | "png" = "jpeg"
) {
  const userPrompt = `You have several tasks:

1. Give one overall topic or theme: THEME.
2. Format any underlined dates with this format YYYYMMDD found on the page, 
   and represent them as ISO-8601 strings, asumming UTC, for example the date
   20240430 should be represented as 2024-03-30T00:00:00.000Z, and only keep the
   ISO-8601 representation: DATES.
2. Summarise what is written in the page: SUMMARY.
3. Give brief opinion on the content: OPINION
4. Give a description of the page layout and how the content is written: DESCRIPTION

Structure your resonse in markdown as follows:
# {THEME}

## Dates
{DATES}

## Summary
{SUMMARY}

## Opinion
{OPINION}

## Description
{DESCRIPTION}
`;

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
    temperature: 0.5,
  });

  return response.choices[0]?.message.content ?? "";
}

export async function describe(path: string) {
  console.log("resolving path");
  const resolved = await resolvePath(path);

  console.log("loading and encoding image to base64");
  const base64 = await loadAndEncodeImageToBase64(resolved);

  console.log("describing handwrite");
  const description = await describeHandwrite(base64);

  console.log(description);
}
