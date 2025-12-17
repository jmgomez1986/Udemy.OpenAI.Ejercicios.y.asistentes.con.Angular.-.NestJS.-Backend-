import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (
  openia: OpenAI,
  { prompt, voice }: Options,
) => {
  const voices = {
    alloy: 'alloy',
    ash: 'ash',
    ballad: 'ballad',
    coral: 'coral',
    echo: 'echo',
    sage: 'sage',
    shimmer: 'shimmer',
    verse: 'verse',
    marin: 'marin',
    cedar: 'cedar',
  };

  const selectedVoice =
    voice && voices[voice.toLowerCase()] ? voices[voice.toLowerCase()] : 'nova';

  const folderPath = path.resolve(__dirname, '../../../generated/audios');
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  fs.mkdirSync(folderPath, { recursive: true });

  const mp3 = await openia.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);

  return speechFile;
};
