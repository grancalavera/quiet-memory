import { createCompletion } from "../lib/createCompletion";

export const describe =
  createCompletion(`You will be given a text document, and you need to perform the following tasks:
- Extract keywords from the text.
- Find dates formatted as YYYYMMDD and reformat them as YYYY-MM-DD.

Format the results as a JSON object with the following structure:

{
  "keywords": ["keyword1", "keyword2", ...],
  "dates": ["YYYY-MM-DD", "YYYY-MM-DD", ...]
}

Only return the JSON document, do not wrap it in triple backticks or any other formatting.
`);
