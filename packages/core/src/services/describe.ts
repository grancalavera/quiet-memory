import { z } from "zod";
import { createCompletion } from "../lib/createCompletion";

export const DocumentMetadata = z.object({
  keywords: z.array(z.string()),
  dates: z
    .array(z.string())
    .transform((dates) => dates.map((x) => new Date(x).toISOString())),
});

export const DocumentDescription = DocumentMetadata.extend({
  document: z.string(),
});

export type DocumentMetadata = z.infer<typeof DocumentMetadata>;
export type DocumentDescription = z.infer<typeof DocumentDescription>;

const completeDescription = createCompletion(
  `You will be given a text document, and you need to perform the following tasks:
- Extract keywords from the text. Keywords should describe the topics covered in the document. \
Keywords should be limited to 5 words or less.
- Find dates formatted as YYYYMMDD and reformat them as YYYY-MM-DD.

Format the results as a JSON object with the following structure:

{
  "keywords": ["keyword1", "keyword2", ...],
  "dates": ["YYYY-MM-DD", "YYYY-MM-DD", ...]
}

Only return the JSON document, do not wrap it in triple backticks or any other formatting.
`
);

export const describe = async (
  document: string
): Promise<DocumentDescription> => {
  const description = await completeDescription(document);
  const metadata = DocumentMetadata.parse(JSON.parse(description));
  return { ...metadata, document };
};
