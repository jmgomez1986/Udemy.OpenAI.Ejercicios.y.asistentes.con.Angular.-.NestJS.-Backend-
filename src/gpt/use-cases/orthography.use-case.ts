import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

interface Options {
  prompt: string;
}

export const orthographyUseCase = async (
  openia: OpenAI,
  googleGenIA: GoogleGenAI,
  options: Options,
) => {
  const { prompt } = options;

  const body = [
    {
      role: 'system',
      content: `Te serán proveídos textos en español con posibles errores ortográficos y gramaticales,
        Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
        Debes de responder en formato JSON, 
        tu tarea es corregirlos y retornar información  de soluciones, 
        también debes de dar un porcentaje de acierto por el usuario,        

        Si no hay errores, debes de retornar un mensaje de felicitaciones.

        Ejemplo de salida:
        {
          userScore: number,
          errors: string[], // ['error -> solución']
          message: string, //  Usa emojis y texto para felicitar al usuario
        }`,
    },
    {
      role: 'user',
      content: `${prompt}`,
    },
  ];

  const completions = await openia.chat.completions.create({
    messages: body as ChatCompletionMessageParam[],
    model: 'gpt-5',
    response_format: {
      type: 'json_object',
    },
  });

  // const response = await openia.responses.create({
  //   input: body as OpenAI.Responses.ResponseInput,
  //   model: 'gpt-5',
  // });

  // console.log(response);

  // return response.output_text; /** Devuelve solo el texto */

  const jsonResp: string = JSON.parse(
    completions.choices[0].message.content || '{}',
  );
  return jsonResp;

  // console.log(prompt);
  // return prompt;

  // const response = await googleGenIA.models.generateContent({
  //   model: 'gemini-2.5-flash',
  //   contents:
  //     'Escribe una oracion de una historia para ir a dormir acerca de un perro llamado Luna.',
  // });

  // return response.text;
};
