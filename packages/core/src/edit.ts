import { listFilesByExtension } from "./lib/listFilesByExtension";
import { loadText } from "./lib/loadText";
import { openai } from "./lib/openai";
import { resolvePath } from "./lib/resolvePath";
import { saveText } from "./lib/saveText";

export const editedSuffix = ".edited.txt";

async function editText(text: string) {
  const systemPrompt = "Fix the typos in the following text:";

  const result = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
    model: "gpt-4",
    temperature: 0,
  });

  return result.choices[0]?.message.content ?? "";
}

export async function editTextCommand(path: string, force: boolean = false) {
  const resolvedPath = await resolvePath(path);

  let result: string | undefined = undefined;

  if (!force) {
    result = await loadText(resolvedPath + editedSuffix);

    if (result) {
      console.log(path + ": Text already edited. Done.");
      return;
    }
  }

  const original = await loadText(resolvedPath);

  if (!original) {
    console.log(path + ": No text found to edit. Done.");
    return;
  }

  console.log(path + ": editing text");
  const edited = await editText(original);

  console.log(path + ": saving edited text");
  await saveText(resolvedPath + editedSuffix, edited);
  console.log(path + ": editing complete " + resolvedPath + editedSuffix);
}

export const editDirCommand = (extension: string) => async (path: string) => {
  const resolvedPath = await resolvePath(path);
  const files = await listFilesByExtension(resolvedPath, extension);
  await Promise.allSettled(files.map((x) => editTextCommand(x)));
};
