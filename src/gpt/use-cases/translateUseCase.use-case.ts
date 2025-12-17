import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (
  openia: OpenAI,
  { prompt, lang }: Options,
) => {
  const body = [
    {
      role: 'system',
      content: `Traduce el siguiente texto al idioma ${lang}`,
    },
    {
      role: 'user',
      content: `${prompt}`,
    },
  ];

  const completions = await openia.chat.completions.create({
    messages: body as ChatCompletionMessageParam[],
    model: 'gpt-5',
  });

  return { message: completions.choices[0].message.content };
};
