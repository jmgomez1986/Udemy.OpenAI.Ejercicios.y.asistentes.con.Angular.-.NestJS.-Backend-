import OpenAI from 'openai';
import * as fs from 'fs';

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openIA: OpenAI, options: Options) => {
  const { audioFile, prompt } = options;

  console.log({ prompt, audioFile });

  const response = await openIA.audio.transcriptions.create({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    file: fs.createReadStream(audioFile.path),
    model: 'whisper-1',
    prompt, // Mismo idioma que el audio
    language: 'es',
    // response_format: 'vtt',
    // response_format: 'srt',
    response_format: 'verbose_json',
  });

  return response;
};
