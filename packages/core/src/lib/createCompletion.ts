import { openai } from "./openai";

export const createCompletion =
  (systemPrompt: string) => async (text: string) => {
    const result = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      model: "gpt-4",
      temperature: 0,
    });

    return result.choices[0]?.message.content ?? "";
  };
