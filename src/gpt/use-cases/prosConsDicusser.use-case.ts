import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

interface Options {
  prompt: string;
}

export const prosConsDicusserUseCase = async (
  openia: OpenAI,
  { prompt }: Options,
) => {
  const body = [
    {
      role: 'system',
      content: `Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                la respuesta debe de ser en formato markdown,
                los pros y contras deben de estar en una lista,`,
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

  return completions.choices[0].message;
};
